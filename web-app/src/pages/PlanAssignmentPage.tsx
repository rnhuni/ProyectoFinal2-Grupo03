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
import { useTranslation } from "react-i18next";

interface PlanAssignmentPageProps {
  client: Client;
  onClose: () => void;
}

const PlanAssignmentPage: React.FC<PlanAssignmentPageProps> = ({
  client,
  onClose,
}) => {
  const { t } = useTranslation(); // Hook para usar las traducciones
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
          title: t("plan_assignment.success_title"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose();
      }
    } catch (error) {
      toast({
        title: t("plan_assignment.error_title"),
        description:
          (error as Error).message || t("plan_assignment.error_description"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" label={t("loading")} />;

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
        <Heading as="h2" size="lg" mb={2}>
          {t("plan_assignment.title")}
        </Heading>
        <Text>{t("plan_assignment.description", { client: client.name })}</Text>
        <Text fontSize="xl" fontWeight="bold" color="purple.500" mt={1}>
          {t("plan_assignment.client_label")}{" "}
          <Badge colorScheme="purple">{client.name}</Badge>
        </Text>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={2}
          mt={3}
        >
          <Select
            placeholder={t("plan_assignment.select_placeholder")}
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
            {t("plan_assignment.select_button")}
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
              {t("plan_assignment.selected_plan_label", {
                plan: selectedPlanDetails.name,
              })}
            </Heading>
            <Text color="gray.600" mb={2}>
              {selectedPlanDetails.description ||
                t("plan_assignment.no_description")}
            </Text>
            <Box mt={2}>
              <Text fontWeight="bold" mb={1}>
                {t("plan_assignment.features")}
              </Text>
              <Wrap>{formatFeatures(selectedPlanDetails.features || "")}</Wrap>
            </Box>
          </Box>
        )}
        <Box mt={6} maxW="100%">
          <Heading as="h3" size="md" mb="3">
            {t("plan_assignment.assignment_history")}
          </Heading>
          <TableContainer
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <Table variant="simple" size="sm">
              <Thead bg="#F2F7FF" h={9}>
                <Tr>
                  <Th>{t("plan_assignment.plan_column")}</Th>
                  <Th>{t("plan_assignment.date_column")}</Th>
                  <Th>{t("plan_assignment.status_column")}</Th>
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
        <Flex justify="flex-end" mt={5} gap={3}>
          <Button
            colorScheme="blue"
            maxW="200px"
            onClick={handleAssignPlan}
            isDisabled={!selectedPlanDetails}
          >
            {t("plan_assignment.assign_button")}
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            {t("plan_assignment.close_button")}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PlanAssignmentPage;
