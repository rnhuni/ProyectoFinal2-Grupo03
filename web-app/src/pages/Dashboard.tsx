import React from "react";
import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import NavBar from "../components/Navbar/NavBar";
import Sidebar from "../components/Aside/Aside";
import { Outlet } from "react-router-dom";
import { useProfileContext } from "../contexts/ProfileContext";

const Dashboard: React.FC = () => {
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");
  const sidebg = useColorModeValue("#0056f0", "gray.800");
  const mainbg = useColorModeValue("white", "gray.700");
  const { profile } = useProfileContext();

  const role = profile?.user?.role?.split("-")[1] || "";
  const name = profile?.user?.name || "";

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
        <NavBar name={name} />
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
        <Sidebar userRole={role} />
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
    </Grid>
  );
};

export default Dashboard;
