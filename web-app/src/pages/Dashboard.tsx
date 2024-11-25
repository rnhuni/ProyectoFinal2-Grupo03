// sonar.ignore
/* istanbul ignore file */
import React, { useEffect, useState } from "react";
import { subscribeNotificationsFunc } from "../appsync";
import NavBar from "../components/Navbar/NavBar";
import Sidebar from "../components/Aside/Aside";
import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useProfileContext } from "../contexts/ProfileContext";

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

const Dashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { profile } = useProfileContext();
  const userId = profile?.user?.id || "";
  const client = profile?.user?.client || "";
  const role = profile?.user?.role?.split("-")[1] || "";
  const currentUserId = role === "client" ? client : userId;

  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");
  const sidebg = useColorModeValue("#0056f0", "gray.800");
  const mainbg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    let subscription: ZenObservable.Subscription | null = null;

    const subscribe = async () => {
      try {
        const observable = await subscribeNotificationsFunc(currentUserId);
        if (observable) {
          subscription = observable.subscribe({
            next: ({ value }: any) => {
              console.log("Notificación recibida:", value);
              const notificationData = JSON.parse(value.data.subscribe.data);

              const notification = {
                ...notificationData,
                arrived_at: new Date().toISOString(),
              };
              setNotifications((prev) => [...prev, notification]);
            },
            error: (error) => {
              console.error(
                "Error en la suscripción de notificaciones:",
                error
              );
            },
          });
        }
      } catch (error) {
        console.error("Error al suscribirse:", error);
      }
    };

    if (userId) {
      subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log("Suscripción limpiada");
      }
    };
  }, [userId]);

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
        <NavBar
          name={profile?.user?.name || ""}
          notifications={notifications}
        />
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
