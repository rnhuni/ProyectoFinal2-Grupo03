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
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const SubscriptionPage: React.FC = () => {
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
            Plan Actual
          </Heading>
          <Flex align="center" mb="4">
            <Icon as={FaCrown} color="black" boxSize={10} />
            <Box pt={2} pl={4}>
              <Text fontWeight="bold">Plan Pro</Text>
              <Text color="gray.600">
                Ofrece todas las funciones avanzadas, soporte prioritario y
                recursos adicionales, ideal para empresas en crecimiento con
                necesidades técnicas avanzadas.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box>
          <Text fontWeight="bold">Fecha de Suscripción</Text>
          <Text mb="4">01/01/2024</Text>

          <Text fontWeight="bold">Monto Pagado</Text>
          <Text mb="4">$85.000,00</Text>

          <Text fontWeight="bold">Próxima Fecha de Facturación</Text>
          <Text mb="4">01/51/2024</Text>
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
                      Método de pago
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    {
                      date: "01/01/2024",
                      amount: "$85.000,00",
                      method: "Tarjeta de Crédito",
                    },
                    { date: "01/12/2023", amount: "$85.000,00", method: "PSE" },
                    {
                      date: "01/11/2023",
                      amount: "$85.000,00",
                      method: "Tarjeta de Crédito",
                    },
                    {
                      date: "01/10/2023",
                      amount: "$85.000,00",
                      method: "Tarjeta de Crédito",
                    },
                  ].map((payment, index) => (
                    <Tr key={index} {...tableRowStyles}>
                      <Td>
                        <Checkbox colorScheme="blue" />
                      </Td>
                      <Td isNumeric>{payment.date}</Td>
                      <Td isNumeric>{payment.amount}</Td>
                      <Td>{payment.method}</Td>
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
          <Button leftIcon={<FiDownload />} {...buttonStyles}>
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
