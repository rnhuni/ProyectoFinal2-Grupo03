import React from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="gray.100"
      textAlign="center"
    >
      <Box>
        <Text fontSize="4xl" fontWeight="bold" mb={4}>
          {t("errorPage.title", "Página no encontrada")}
        </Text>
        <Text fontSize="lg" mb={8}>
          {t(
            "errorPage.message",
            "Lo sentimos, no pudimos encontrar la página que estás buscando."
          )}
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate(-1)} // Volver a la página anterior
        >
          {t("errorPage.back", "Volver")}
        </Button>
      </Box>
    </Flex>
  );
};

export default ErrorPage;
