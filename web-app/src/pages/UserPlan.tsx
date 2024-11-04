import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Switch,
  Icon,
  InputGroup,
  InputLeftElement,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
  TableContainer,
} from "@chakra-ui/react";
import { FiSearch, FiUser, FiFileText } from "react-icons/fi";
import StatusBadge from "../components/StatusBadge";

const PlanAssignmentPage: React.FC = () => {
  const plans = ["Plan Básico", "Plan Avanzado", "Plan Premium", "Plan Pro"];
  const assignments = [
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Enero-2024",
      status: "Active",
    },
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Diciembre-2023",
      status: "Suspended",
    },
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Noviembre-2023",
      status: "Suspended",
    },
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Octubre-2023",
      status: "Suspended",
    },
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Septiembre-2023",
      status: "Suspended",
    },
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Agosto-2023",
      status: "Suspended",
    },
  ];

  return (
    <Box mx="auto" p="6" maxW="1200px">
      <Flex direction="column" gap={6}>
        <Heading as="h1" size="lg">
          Asignación de plan a usuario
        </Heading>
        <Text>
          Complete el siguiente formulario con la información requerida.
        </Text>

        <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
          <InputGroup maxW="300px">
            <InputLeftElement
              pointerEvents="none"
              children={<FiUser color="gray.400" />}
            />
            <Input placeholder="Nombre" variant="outline" />
          </InputGroup>
          <InputGroup maxW="300px">
            <InputLeftElement
              pointerEvents="none"
              children={<FiSearch color="gray.400" />}
            />
            <Input placeholder="Buscar" variant="outline" />
          </InputGroup>
        </Flex>

        <Wrap spacing={2} mb={4}>
          {plans.map((plan, idx) => (
            <WrapItem key={idx}>
              <Tag
                size="lg"
                colorScheme="purple"
                borderRadius="full"
                variant="solid"
              >
                <TagLabel>{plan}</TagLabel>
                <TagCloseButton />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>

        <Box mt={8} maxW="100%">
          <Heading as="h2" size="md" mb="4">
            Historial de asignaciones
          </Heading>
          <TableContainer
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <Table variant="simple" size="sm">
              <Thead bg="#F2F7FF" h={10}>
                <Tr>
                  <Th>Plan</Th>
                  <Th>Fecha</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {assignments.map((assignment, idx) => (
                  <Tr key={idx} _hover={{ bg: "gray.100" }}>
                    <Td display="flex" alignItems="center">
                      <Icon as={FiFileText} mr={2} />
                      <Box>
                        <Text fontWeight="bold">{assignment.plan}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {assignment.price}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{assignment.date}</Td>
                    <Td>
                      <StatusBadge
                        status={
                          assignment.status.toLowerCase() as
                            | "active"
                            | "suspended"
                            | "inactive"
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Flex align="center" mt={8}>
          <Text fontWeight="bold" mr="4">
            Enviar notificaciones por correo electrónico
          </Text>
          <Switch size="lg" colorScheme="blue" />
        </Flex>

        <Flex justify="flex-end" mt={8}>
          <Button colorScheme="blue" size="lg" maxW="200px">
            Asignar Plan
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PlanAssignmentPage;
