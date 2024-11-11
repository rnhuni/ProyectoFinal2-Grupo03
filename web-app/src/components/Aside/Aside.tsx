import { useState } from "react";
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
import {
  Plus,
  BarChartLine,
  CalendarEvent,
  CashStack,
  People,
  ClipboardData,
  Gear,
  Person,
  ListCheck,
  TicketDetailed,
  Receipt,
  PersonBadge,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [active, setActive] = useState("Usuario");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Crear", icon: <Plus />, path: "/dashboard/create" },
    { name: "Resumen", icon: <BarChartLine />, path: "/dashboard/summary" },
    { name: "Usuario", icon: <Person />, path: "/dashboard/users" },
    {
      name: "Incidentes",
      icon: <CalendarEvent />,
      path: "/dashboard/incidents",
    },
    { name: "Planes", icon: <CashStack />, path: "/dashboard/plans" },
    { name: "Roles", icon: <People />, path: "/dashboard/roles" },
    { name: "Actividad", icon: <ClipboardData />, path: "/dashboard/activity" },
    { name: "Permisos", icon: <ListCheck />, path: "/dashboard/permissions" },
    {
      name: "Mi suscripción",
      icon: <Receipt />,
      path: "/dashboard/user-plan",
    },
    {
      name: "Suscripciones",
      icon: <TicketDetailed />,
      path: "/dashboard/suscriptions",
    },
    {
      name: "Manejar planes",
      icon: <PersonBadge />,
      path: "/dashboard/manage-plan",
    },
  ];

  const adminItem = { name: "Admin", icon: <Gear />, path: "/dashboard/admin" };

  const handleMenuClick = (item: { name: string; path: string }) => {
    setActive(item.name);
    navigate(item.path);
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
        <Flex justifyContent="center" alignItems="center" pt={4}>
          <Image src={logo} alt="Logo" boxSize="80px" />
        </Flex>
        <List
          spacing={2}
          m={0}
          p={0}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {menuItems.map((item) => (
            <ListItem
              key={item.name}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => handleMenuClick(item)}
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
                {item.icon}
              </Box>
              <Text fontSize="12px" color="white" textAlign="center">
                {item.name}
              </Text>
            </ListItem>
          ))}
          <Divider my={2} borderColor="white" borderWidth="1px" width="80%" />
          <ListItem
            key={adminItem.name}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={() => handleMenuClick(adminItem)}
            m={0}
            p={0}
            width="100%"
            mb={4}
          >
            <Box
              as="span"
              fontSize="24px"
              bg={active === adminItem.name ? "white" : "transparent"}
              color={active === adminItem.name ? "#0056f0" : "white"}
              h={8}
              w={12}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="xl"
              mb={1}
            >
              {adminItem.icon}
            </Box>
            <Text fontSize="12px" color="white" textAlign="center">
              {adminItem.name}
            </Text>
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};

export default Sidebar;
