import React, { useState } from "react";
import {
  MoonIcon,
  QuestionOutlineIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { FaRegBell } from "react-icons/fa6";
import userImg from "../../assets/user.svg";
import { useTranslation } from "react-i18next";
import {
  Flex,
  Box,
  Heading,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useProfileContext } from "../../contexts/ProfileContext";

interface Notification {
  type: string;
  payload:
    | {
        id: string;
        message: string;
      }
    | {
        id: string;
        action: string;
      };
  arrived_at: string;
}

interface NavBarProps {
  name: string;
  notifications: Notification[];
}

const NavBar: React.FC<NavBarProps> = ({ name, notifications }) => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useProfileContext();
  const color = useColorModeValue("black", "white");
  const { toggleColorMode } = useColorMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const unreadCount = notifications.length;

  return (
    <>
      <Flex
        as="nav"
        bg={useColorModeValue("gray.100", "gray.900")}
        color={color}
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={1}
        h="6vh"
        boxShadow="md"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Heading
          size="md"
          fontSize="1.3rem"
          fontWeight="bold"
          fontFamily="sans-serif"
          color={color}
        >
          ABCall
        </Heading>
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            aria-label="Dark/Light mode"
            icon={<MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
          <IconButton
            aria-label="Help"
            icon={<QuestionOutlineIcon />}
            variant="ghost"
            size="sm"
          />
          <Box position="relative">
            <IconButton
              aria-label="Bell Notification"
              icon={<FaRegBell />}
              onClick={() => setIsModalOpen(true)}
              variant="ghost"
              size="sm"
            />
            {unreadCount > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                borderRadius="full"
                bg="red.500"
                color="white"
                fontSize="0.7em"
                px={2}
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              variant="outline"
            >
              {language === "es" ? "🇨🇴" : "🇺🇸"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => changeLanguage("es")}>
                🇨🇴 Español
              </MenuItem>
              <MenuItem onClick={() => changeLanguage("en")}>
                🇺🇸 English
              </MenuItem>
            </MenuList>
          </Menu>
          <Box
            display="flex"
            border="1px"
            borderColor="#aaaaaa"
            as="button"
            borderRadius="lg"
            color={color}
            _hover={{
              backgroundColor: "#0056f0",
              transform: "scale(1.02)",
              color: "white",
            }}
            px={2}
            py={1}
          >
            <Stack flexDirection="row" gap={2} alignItems="center">
              <Text fontSize="sm">{name}</Text> {/* Tamaño reducido */}
              <Image p="3px" boxSize="32px" borderRadius="full" src={userImg} />
            </Stack>
          </Box>
        </Stack>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notificaciones</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {notifications.length === 0 ? (
              <Text>No hay notificaciones nuevas</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {notifications.map((notif) => (
                  <Box
                    key={notif?.payload?.id}
                    p={3}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Text fontWeight="bold">{notif.type}</Text>
                    <Text>
                      {"message" in notif.payload
                        ? notif.payload.message
                        : notif.payload.action}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(notif.arrived_at).toLocaleString()}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NavBar;
