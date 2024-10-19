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
  Text,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import PlanFilterDrawer from "../components/Plans/PlanFilterDrawer";
import PlanFormModal from "../components/Plans/PlanFormModal";
import DeleteConfirmationModal from "../components/Plans/DeleteConfirmationModal";
import { Plan } from "../interfaces/Plan";
import PlanDetailsModal from "../components/Plans/PlanDetailsModal";

const Plans = () => {
  const { t } = useTranslation();

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Basic Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: 10000.5, // Ahora es un número con decimales
      features: "24/7 Technical support, 1TB Storage",
    },
    {
      id: "2",
      name: "Advanced Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: 35000.75, // Número con decimales
      features: "24/7 Technical support, Advanced Analytics",
    },
    {
      id: "3",
      name: "Premium Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: 65000.99, // Número con decimales
      features: "24/7 Technical support, Premium Integration, Custom Reporting",
    },
    {
      id: "4",
      name: "Pro Plan",
      description: "Limited access to essential functions.",
      status: "Active",
      price: 85000.25, // Número con decimales
      features: "Priority Support 24/7, Unlimited Users, Real-Time Monitoring",
    },
  ]);

  const [filteredPlans, setFilteredPlans] = useState<Plan[]>(plans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedPlan(null);
    setIsFormModalOpen(true);
  };

  const handleSave = (updatedPlan: Plan) => {
    if (formMode === "edit") {
      setPlans((prevPlans) =>
        prevPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      );
    } else if (formMode === "create") {
      setPlans((prevPlans) => [
        ...prevPlans,
        { ...updatedPlan, id: (prevPlans.length + 1).toString() },
      ]);
    }
    setIsFormModalOpen(false);
  };

  const applyFilters = (filters: { field: string; searchValue: string }) => {
    console.log("Aplicando filtros: ", filters);

    const { field, searchValue } = filters;

    if (!searchValue) {
      setFilteredPlans(plans);
      return;
    }

    const filtered = plans.filter((plan) => {
      const planFieldValue = plan[field as keyof Plan]
        ?.toString()
        .toLowerCase();
      return planFieldValue?.includes(searchValue.toLowerCase());
    });

    setFilteredPlans(filtered);
  };

  const clearFilters = () => {
    setFilteredPlans(plans);
  };

  const handleViewDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPlan) {
      setPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== selectedPlan.id)
      );
      setFilteredPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== selectedPlan.id)
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  const isFiltered = filteredPlans.length !== plans.length;

  return (
    <Box p={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {t("plans.title")}
        </Text>
        <Stack direction="row" spacing={4}>
          <PlanFilterDrawer applyFilters={applyFilters} />
          {isFiltered && (
            <Button colorScheme="gray" variant="outline" onClick={clearFilters}>
              {t("plans.clear_filters", "Limpiar Filtros")}
            </Button>
          )}
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={handleCreate}
          >
            {t("plans.create")}
          </Button>
        </Stack>
      </Stack>

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
          {filteredPlans.map((plan) => (
            <Tr key={plan.id}>
              <Td>
                <Checkbox />
              </Td>
              <Td fontWeight="bold">{plan.name}</Td>
              <Td>{plan.description}</Td>
              <Td>
                <Badge colorScheme="green">{t("status.active")}</Badge>
              </Td>
              <Td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(plan.price)}
              </Td>
              <Td>{plan.features}</Td>
              <Td>
                <IconButton
                  aria-label="View details"
                  icon={<ViewIcon />}
                  onClick={() => handleViewDetails(plan)}
                  variant="ghost"
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Edit plan"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(plan)}
                  variant="ghost"
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Delete plan"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(plan)}
                  variant="ghost"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PlanDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        plan={selectedPlan}
      />

      <PlanFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        plan={formMode === "edit" ? selectedPlan : null}
        mode={formMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        planName={selectedPlan?.name || ""}
      />
    </Box>
  );
};

export default Plans;
