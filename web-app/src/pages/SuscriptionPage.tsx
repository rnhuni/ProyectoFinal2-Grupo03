import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Switch,
  Flex,
  Icon,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import useActiveSubscription from "../hooks/invoices/useActiveSubscription";
import usePayments from "../hooks/invoices/usePayments";

const SubscriptionPage: React.FC = () => {
  const {
    activeSubscription,
    loading: activeLoading,
    error: activeError,
  } = useActiveSubscription();

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
  } = usePayments();

  // Función para descargar el historial de pagos como archivo CSV
  const downloadPaymentsCSV = () => {
    const csvContent = [
      ["Fecha de Pago", "Monto", "Descripción", "Estado"], // Cabeceras
      ...payments.map((payment) => [
        payment.date,
        payment.amount,
        payment.description,
        payment.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "historial_de_pagos.csv");
    link.click();
  };

  if (activeLoading || paymentsLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" label="Cargando datos de suscripción y pagos..." />
      </Flex>
    );
  }

  if (activeError || paymentsError) {
    return (
      <Box mx="auto" p="6">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Hubo un error al cargar los datos. Por favor, inténtalo de nuevo más
          tarde.
        </Alert>
      </Box>
    );
  }

  return (
    <Box mx="auto" p="6">
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Suscripción y Detalles de Pago
          </Heading>
        </Flex>

        <Box>
          <Heading as="h2" size="md" mb="2">
            {activeSubscription?.baseName || "Plan Actual"}
          </Heading>
          <Flex align="center" mb="4">
            <Icon as={FaCrown} color="black" boxSize={10} />
            <Box pt={2} pl={4}>
              <Text fontWeight="bold">{activeSubscription?.baseName}</Text>
              <Text color="gray.600">{activeSubscription?.description}</Text>
            </Box>
          </Flex>
        </Box>

        <Box>
          <Text fontWeight="bold">Fecha de Suscripción</Text>
          <Text mb="4">
            {activeSubscription?.createdAt
              ? new Date(activeSubscription.createdAt).toLocaleDateString()
              : "Fecha no disponible"}
          </Text>

          <Text fontWeight="bold">Monto Pagado</Text>
          <Text mb="4">${activeSubscription?.price.toLocaleString()}</Text>

          <Text fontWeight="bold">Última Actualización</Text>
          {activeSubscription?.updatedAt
            ? new Date(activeSubscription?.updatedAt).toLocaleDateString()
            : "Fecha no disponible"}
        </Box>

        <Flex wrap="wrap" gap={6} flexDirection={"column"}>
          <Box flex="1" maxW="900px" mb="6">
            <Heading as="h2" size="md" mb="4">
              Historial de Pagos
            </Heading>
            <TableContainer
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              boxShadow="sm"
            >
              <Table variant="simple" size="sm">
                <Thead bg={"#F2F7FF"} h={10}>
                  <Tr>
                    <Th w="5%" {...tableHeaderStyles}>
                      <Checkbox colorScheme="blue" />
                    </Th>
                    <Th w="30%" isNumeric {...tableHeaderStyles}>
                      Fecha de pago
                    </Th>
                    <Th w="30%" isNumeric {...tableHeaderStyles}>
                      Monto
                    </Th>
                    <Th w="35%" fontWeight="bold" color="gray.600">
                      Descripción
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {payments?.map((payment) => (
                    <Tr key={payment.id} {...tableRowStyles}>
                      <Td>
                        <Checkbox colorScheme="blue" />
                      </Td>
                      <Td isNumeric>{payment.date}</Td>
                      <Td isNumeric>${payment.amount.toLocaleString()}</Td>
                      <Td>{payment.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box flex="1" minW="300px" mb="6">
            <Flex align="center">
              <Text fontWeight="bold" mr="4">
                Notificaciones Automáticas
              </Text>
              <Switch size="lg" colorScheme="blue" />
            </Flex>
          </Box>
        </Flex>

        <Box>
          <Button
            leftIcon={<FiDownload />}
            onClick={downloadPaymentsCSV}
            {...buttonStyles}
          >
            Descargar historial de pagos
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

const buttonStyles = {
  bg: "#6C728F",
  color: "#ffffff",
  variant: "solid",
  borderRadius: "xl",
  minH: 12,
  w: 600,
  _hover: { bg: "#2A55EE" },
};

const tableHeaderStyles = {
  fontWeight: "bold",
  color: "gray.600",
  borderRight: "1px solid",
  borderColor: "gray.200",
};

const tableRowStyles = {
  _hover: { bg: "gray.100" },
  borderRight: "1px solid",
  borderColor: "gray.200",
};

export default SubscriptionPage;
