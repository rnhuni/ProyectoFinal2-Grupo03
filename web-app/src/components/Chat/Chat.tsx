import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  Flex,
  Input,
  Button,
  Avatar,
  AvatarBadge,
  Text,
  useToast,
  Divider as ChakraDivider,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useChannels from "../../hooks/channels/useChannels"; 
import { Message } from "../../interfaces/Messages";

interface ChatProps {
  incidentId: string;
}

const Chat: React.FC<ChatProps> = ({ incidentId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    loading,
    loadIncidentSession,
    reloadMessages,
    createIncidentMessage,
  } = useChannels();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]); // Define el estado local para los mensajes

  useEffect(() => {
    console.log("Id del incidente:", incidentId);
    const fetchSessionAndMessages = async () => {
      const session = await loadIncidentSession(incidentId);
      if (session) {
        const messages = await reloadMessages(session.id);
        setLocalMessages(messages);
      }
    };
    fetchSessionAndMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim().length && !file) {
      toast({
        title: t("chat.attachment"),
        description: t("chat.typeMessage"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file) {
      const fileMessage: Message = {
        body: "",
        source_name: "me",
        source_type: "user",
      };
      setLocalMessages((old) => [...old, fileMessage]);
      setFile(null);
    } else {
      createIncidentMessage(inputMessage);
      setInputMessage("");

      setTimeout(() => {
        setLocalMessages((old) => [
          ...old,
          {
            body: inputMessage,
            source_name: "computer",
            source_type: "system",
          },
        ]);
      }, 1000);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const AlwaysScrollToBottom: React.FC = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView();
      }
    });
    return <div ref={elementRef} />;
  };

  return (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      justify="space-between"
      align="center"
    >
      <Flex w="100%" flexDir="column" align="center">
        <Flex w="100%" align="center" mb={4}>
          <Avatar size="lg" name="ABCall Bot" src="https://bit.ly/dan-abramov">
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Flex flexDirection="column" mx="5" justify="center">
            <Text fontSize="lg" fontWeight="bold">
              ABCall Bot
            </Text>
            <Text color="green.500">{t("chat.online")}</Text>
          </Flex>
        </Flex>
        <ChakraDivider w="100%" borderBottomWidth="3px" color="black" mb={4} />
        <Flex w="100%" h="60vh" overflowY="scroll" flexDirection="column" p="3">
          {loading ? (
            <Spinner size="xl" />
          ) : (
            localMessages.map((item, index) => (
              <Flex
                key={index}
                w="100%"
                justify={
                  item.source_type === "user" ? "flex-end" : "flex-start"
                }
              >
                <Flex
                  bg={item.source_type === "user" ? "black" : "gray.100"}
                  color={item.source_type === "user" ? "white" : "black"}
                  minW="100px"
                  maxW="350px"
                  my="1"
                  p="3"
                  flexDirection="column"
                >
                  {item.source_type === "agent" && (
                    <Text fontWeight="bold">{item.source_name}</Text>
                  )}
                  <Text>{item.body}</Text>
                </Flex>
              </Flex>
            ))
          )}
          <AlwaysScrollToBottom />
        </Flex>
      </Flex>
      <ChakraDivider w="100%" borderBottomWidth="3px" color="black" mt={4} />
      <Flex w="100%" mt={4}>
        <Input
          type="file"
          onChange={handleFileChange}
          display="none"
          id="file-input"
        />

        <Input
          placeholder={t("chat.typeMessage")}
          border="none"
          borderRadius="none"
          _focus={{
            border: "1px solid black",
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button
          bg="black"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "white",
            color: "black",
            border: "1px solid black",
          }}
          disabled={inputMessage.trim().length <= 0 && !file}
          onClick={handleSendMessage}
        >
          {t("chat.send")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Chat;
