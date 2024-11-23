import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  Flex,
  Input,
  Button,
  Avatar,
  AvatarBadge,
  Text,
  Divider as ChakraDivider,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useChannels from "../../hooks/channels/useChannels";
import useSuscribeGraphql from "../../hooks/user/useSuscribeGraphql";
import { Message } from "../../interfaces/Messages";
import publishToChannel from "/src/hooks/user/usePublishGraphql";

interface ChatProps {
  incidentId: string;
}

const Chat: React.FC<ChatProps> = ({ incidentId }) => {
  const { t } = useTranslation();
  const {
    loading,
    loadIncidentSession,
    reloadMessages,
    createIncidentMessage,
  } = useChannels();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]); // Define el estado local para los mensajes
  const { received } = useSuscribeGraphql(incidentId);

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

  useEffect(() => {
    if (received) {
      const message: Message = JSON.parse(received).data;
      const newMessage = {
        body: message.body,
        source_name: message.source_name,
        source_type: message.source_type,
      };
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [received]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // enviar al backend
      // enviarlo a graphql
      const dataToSend = {
        body: inputMessage,
        source_name: "nameUser",
        source_type: "agent",
      };
      setInputMessage("");
      const jsonData = JSON.stringify({ data: dataToSend });

      // console.log('dataToSend usePublishGraphql: ', jsonData);
      await publishToChannel(jsonData, incidentId);
      // console.log('resp usePublishGraphql: ', resp);
      // console.log('createIncidentMessage: ', inputMessage);
      await createIncidentMessage(inputMessage);
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
          disabled={inputMessage.trim().length === 0}
          onClick={handleSendMessage}
        >
          {t("chat.send")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Chat;
