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
  IconButton,
  Image,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface Message {
  from: "me" | "computer";
  text: string;
  file?: string;
  fileName?: string;
}

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { from: "computer", text: t("chat.welcome") },
    { from: "me", text: t("chat.greeting") },
    { from: "me", text: t("chat.introduction") },
    {
      from: "computer",
      text: t("chat.reply"),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();

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
        from: "me",
        text: "",
        file: URL.createObjectURL(file),
        fileName: file.name,
      };
      setMessages((old) => [...old, fileMessage]);
      setFile(null);
    } else {
      const data = inputMessage;
      setMessages((old) => [...old, { from: "me", text: data }]);
      setInputMessage("");

      setTimeout(() => {
        setMessages((old) => [...old, { from: "computer", text: data }]);
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
          {messages.map((item, index) => {
            if (item.from === "me") {
              return (
                <Flex key={index} w="100%" justify="flex-end">
                  <Flex
                    bg="black"
                    color="white"
                    minW="100px"
                    maxW="350px"
                    my="1"
                    p="3"
                    flexDirection="column"
                  >
                    {item.file ? (
                      <>
                        {item.fileName &&
                        item.fileName.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <Image src={item.file} alt={item.fileName} mb="2" />
                        ) : (
                          <AttachmentIcon mb="2" />
                        )}
                        <a href={item.file} download>
                          {item.fileName}
                        </a>
                      </>
                    ) : (
                      <Text>{item.text}</Text>
                    )}
                  </Flex>
                </Flex>
              );
            } else {
              return (
                <Flex key={index} w="100%">
                  <Avatar
                    name="ABCCall Bot"
                    src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                    bg="blue.300"
                  ></Avatar>
                  <Flex
                    bg="gray.100"
                    color="black"
                    minW="100px"
                    maxW="350px"
                    my="1"
                    p="3"
                  >
                    <Text>{item.text}</Text>
                  </Flex>
                </Flex>
              );
            }
          })}
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
        <IconButton
          as="label"
          htmlFor="file-input"
          icon={<AttachmentIcon />}
          bg="black"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "white",
            color: "black",
            border: "1px solid black",
          }}
          mr="2"
          aria-label={t("chat.attachment")}
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
