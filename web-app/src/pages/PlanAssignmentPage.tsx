import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
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
  Select,
  Wrap,
  TableContainer,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";
import StatusBadge from "../components/StatusBadge";
import { Client } from "../interfaces/Client";
import usePlans from "../hooks/plans/usePlans";
import { Plan } from "../interfaces/Plan";

interface PlanAssignmentPageProps {
  client: Client;
  onClose: () => void;
}

const PlanAssignmentPage: React.FC<PlanAssignmentPageProps> = ({
  client,
  onClose,
}) => {
  const { getPlanById, assignPlanToClient, plan, reloadPlans, plans, loading } =
    usePlans();
  const toast = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(""); // ID del plan seleccionado
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(
    null
  ); // Detalles del plan seleccionado

  const assignments = [
    {
      plan: "Plan Básico",
      price: "$10,000/mes",
      date: "01-Enero-2024",
      status: "active",
    },
    {
      plan: "Plan Premium",
      price: "$20,000/mes",
      date: "01-Febrero-2024",
      status: "suspended",
    },
  ];

  // Cargar todos los planes al montar el componente
  useEffect(() => {
    reloadPlans();
  }, []);

  useEffect(() => {
    if (
      client.subscription_plan.id &&
      (!plan || plan.id !== client.subscription_plan.id)
    ) {
      getPlanById(client.subscription_plan.id);
    }
  }, [client.subscription_plan.id, plan]);

  const handleSelectPlan = () => {
    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    if (selectedPlan) {
      setSelectedPlanDetails(selectedPlan);
    }
  };

  const handleAssignPlan = async () => {
    try {
      const updatedClient = await assignPlanToClient(client.id, selectedPlanId);
      if (updatedClient) {
        toast({
          title: "Plan asignado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose();
      }
    } catch (error) {
      toast({
        title: "Error al asignar el plan.",
        description:
          (error as Error).message || "Inténtalo de nuevo más tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  const formatFeatures = (features: string | string[]) => {
    const featuresArray = Array.isArray(features)
      ? features
      : features.split(";");
    return featuresArray.map((feature) => {
      const formattedFeature = feature
        .replace("frt-", "")
        .replace(/-/g, " ")
        .trim();
      return (
        <Tag key={feature} colorScheme="teal" mr={2} mb={2}>
          {formattedFeature}
        </Tag>
      );
    });
  };

  return (
    <Box mx="auto" p="6" maxW="1200px">
      <Flex direction="column" gap={4}>
        {" "}
        <Heading as="h2" size="lg" mb={2}>
          {" "}
          Asignación de plan
        </Heading>
        <Text>
          Complete el siguiente formulario con la información requerida para el
          cliente <strong>{client.name}</strong>.
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="purple.500" mt={1}>
          {" "}
          Cliente: <Badge colorScheme="purple">{client.name}</Badge>
        </Text>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={2}
          mt={3}
        >
          <Select
            placeholder="Seleccionar un plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            maxW="300px"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="blue"
            onClick={handleSelectPlan}
            isDisabled={!selectedPlanId}
          >
            Seleccionar
          </Button>
        </Flex>
        {selectedPlanDetails && (
          <Box
            mt={5}
            p={3}
            borderRadius="md"
            border="1px"
            borderColor="gray.300"
          >
            <Heading as="h3" size="md" mb={1}>
              {" "}
              Plan seleccionado: {selectedPlanDetails.name}
            </Heading>
            <Text color="gray.600" mb={2}>
              {selectedPlanDetails.description || "Sin descripción disponible"}
            </Text>
            <Box mt={2}>
              {" "}
              <Text fontWeight="bold" mb={1}>
                Características:
              </Text>
              <Wrap>{formatFeatures(selectedPlanDetails.features || "")}</Wrap>
            </Box>
          </Box>
        )}
        <Box mt={6} maxW="100%">
          {" "}
          <Heading as="h3" size="md" mb="3">
            {" "}
            Historial de asignaciones
          </Heading>
          <TableContainer
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <Table variant="simple" size="sm">
              <Thead bg="#F2F7FF" h={9}>
                {" "}
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
        <Flex align="center" mt={6}>
          <Text fontWeight="bold" mr="3">
            {" "}
            Enviar notificaciones por correo electrónico
          </Text>
          <Switch size="lg" colorScheme="blue" />
        </Flex>
        <Flex justify="flex-end" mt={5} gap={3}>
          {" "}
          <Button
            colorScheme="blue"
            maxW="200px"
            onClick={handleAssignPlan}
            isDisabled={!selectedPlanDetails}
          >
            Asignar Plan
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PlanAssignmentPage;
