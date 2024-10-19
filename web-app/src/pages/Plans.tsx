import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  HStack,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  description: string;
  status: string;
  price: string;
  features: string;
}

const Plans = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Basic Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: "$10.000",
      features: "24/7 Technical support",
    },
    {
      id: "2",
      name: "Advanced Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: "$35.000",
      features: "24/7 Technical support",
    },
    {
      id: "3",
      name: "Premium Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: "$65.000",
      features: "24/7 Technical support",
    },
    {
      id: "4",
      name: "Pro Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: "$85.000",
      features: "24/7 Technical support",
    },
  ]);

  const handleEdit = (plan: Plan) => {
    console.log("Edit Plan", plan);
  };

  const handleDelete = (planId: string) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {t("plans.title")}
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={() => console.log("Create Plan")}
        >
          {t("plans.create")}
        </Button>
      </HStack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox />
            </Th>
            <Th>{t("plans.name")}</Th>
            <Th>{t("plans.description")}</Th>
            <Th>{t("plans.status")}</Th>
            <Th>{t("plans.price")}</Th>
            <Th>{t("plans.features")}</Th>
            <Th>{t("plans.details")}</Th>
            <Th>{t("plans.edit")}</Th>
            <Th>{t("plans.delete")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {plans.map((plan) => (
            <Tr key={plan.id}>
              <Td>
                <Checkbox />
              </Td>
              <Td fontWeight="bold">{plan.name}</Td>
              <Td>{plan.description}</Td>
              <Td>
                <Badge colorScheme="green">{t("status.active")}</Badge>
              </Td>
              <Td>{plan.price}</Td>
              <Td>{plan.features}</Td>
              <Td>
                <IconButton
                  aria-label="View details"
                  icon={<ViewIcon />}
                  onClick={() => console.log("View Details", plan)}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Edit plan"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(plan)}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Delete plan"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(plan.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Plans;
