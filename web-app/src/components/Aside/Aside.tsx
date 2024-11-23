import React, { useState } from "react";
import {
  Box,
  Image,
  List,
  ListItem,
  Flex,
  Text,
  Divider,
} from "@chakra-ui/react";
import logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";
import { routesConfig } from "../../routesConfig";

interface SidebarProps {
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [active, setActive] = useState<string>("Usuario");
  const navigate = useNavigate();

  const filteredMenuItems = routesConfig.filter((route) =>
    route.roles.includes(userRole)
  );

  const handleMenuClick = (path: string, name: string) => {
    setActive(name);
    navigate(path);
  };

  return (
    <Box
      width="80px"
      height="100vh"
      color="white"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      transition="width 0.3s"
      overflow="hidden"
    >
      <Flex direction="column" align="center" h="100%">
        {/* Logo */}
        <Flex justifyContent="center" alignItems="center" pt={4}>
          <Image src={logo} alt="Logo" boxSize="80px" />
        </Flex>

        {/* Menú dinámico */}
        <List
          spacing={2}
          m={0}
          p={0}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {filteredMenuItems.map((item) => (
            <ListItem
              key={item.name}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => handleMenuClick(item.path, item.name)}
              m={0}
              p={0}
            >
              <Box
                as="span"
                fontSize="24px"
                bg={active === item.name ? "white" : "transparent"}
                color={active === item.name ? "#0056f0" : "white"}
                h={8}
                w={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="xl"
                mb={1}
              >
                {/* Usamos el ícono directamente */}
                {item.icon}
              </Box>
              <Text fontSize="12px" color="white" textAlign="center">
                {item.name}
              </Text>
            </ListItem>
          ))}

          {/* Divider */}
          <Divider my={2} borderColor="white" borderWidth="1px" width="80%" />
        </List>
      </Flex>
    </Box>
  );
};

export default Sidebar;
