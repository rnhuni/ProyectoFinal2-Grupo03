import React from "react";
import {
  Box,
  Grid,
  GridItem,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  IconButton,
  useDisclosure,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import NavBar from "../components/Navbar/NavBar";
import Sidebar from "../components/Aside/Aside";
import { Outlet } from "react-router-dom";
import Chat from "../components/Chat/Chat";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");
  const sidebg = useColorModeValue("#0056f0", "gray.800");
  const mainbg = useColorModeValue("white", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"aside nav" "aside main"`,
      }}
      templateRows="auto 1fr"
      templateColumns={{ base: "1fr", lg: "5vw 1fr" }}
      h="100vh"
    >
      <GridItem area="nav" bg={bg} color={color} w="100%" h="auto">
        <NavBar />
      </GridItem>

      <GridItem
        area="aside"
        bg={sidebg}
        w="100%"
        h="100%"
        display={{ base: "none", lg: "flex" }}
        alignItems="center"
        justifyContent="center"
      >
        <Sidebar />
      </GridItem>

      <GridItem
        area="main"
        bg={mainbg}
        w="100%"
        h="100%"
        display="flex"
        p={{ base: "2vh 1vw", lg: "2vh 1vw" }}
      >
        <Box w="100%" h="100%" overflow="auto">
          <Outlet />
        </Box>
      </GridItem>

      <Tooltip
        label={t("dashboard.openChat")}
        aria-label={t("dashboard.openChatTooltip")}
      >
        <IconButton
          icon={<ChatIcon />}
          colorScheme="teal"
          aria-label={t("dashboard.openChat")}
          position="fixed"
          bottom="20px"
          right="20px"
          borderRadius="full"
          boxShadow="lg"
          size="lg"
          onClick={onOpen}
          ref={btnRef}
        />
      </Tooltip>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("dashboard.chat")}</DrawerHeader>

          <DrawerBody>
            <Flex w="100%" h="100%" justify="center" align="center">
              <Chat />
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              {t("dashboard.close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
};

export default Dashboard;
