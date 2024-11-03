import { MoonIcon, QuestionOutlineIcon, SearchIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

const NavBar = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("es");
  const color = useColorModeValue("black", "white");
  const { toggleColorMode } = useColorMode();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <Flex
      as="nav"
      bg={useColorModeValue("gray.100", "gray.900")}
      color={color}
      alignItems="center"
      justifyContent="space-between"
      px={4} // Ajusta el padding horizontal
      py={1} // Reduce el padding vertical para disminuir la altura
      h="6vh" // Reducir la altura del NavBar
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo */}
      <Heading
        size="md" // Tamaño reducido para el logo
        fontSize="1.3rem"
        fontWeight="bold"
        fontFamily="sans-serif"
        color={color}
      >
        ABCall
      </Heading>

      {/* Right side - Icons and User */}
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
        <IconButton
          aria-label="Bell Notification"
          icon={<FaRegBell />}
          variant="ghost"
          size="sm"
        />
        {/* Language Switcher */}
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
            <MenuItem onClick={() => changeLanguage("es")}>🇨🇴 Español</MenuItem>
            <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
          </MenuList>
        </Menu>
        {/* User Information */}
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
          py={1} // Reducir el padding vertical para ajustarse a la nueva altura
        >
          <Stack flexDirection="row" gap={2} alignItems="center">
            <Text fontSize="sm">Jhon Doe</Text> {/* Tamaño reducido */}
            <Image p="3px" boxSize="32px" borderRadius="full" src={userImg} />
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default NavBar;
