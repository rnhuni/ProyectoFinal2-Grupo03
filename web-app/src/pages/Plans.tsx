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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import PlanFilterDrawer from "../components/Plans/PlanFilterDrawer";
import PlanFormModal from "../components/Plans/PlanFormModal";
import { Plan } from "../interfaces/Plan";
import PlanDetailsModal from "../components/Plans/PlanDetailsModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import usePlans from "../hooks/plans/usePlans";

const Plans = () => {
  const { t } = useTranslation();
  const {
    plans,
    loading,
    error,
    reloadPlans,
    createPlan,
    updatePlan,
    deletePlan,
  } = usePlans();

  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    reloadPlans();
  }, []);

  useEffect(() => {
    setFilteredPlans(plans);
  }, [plans]);

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

  const handleSave = async (updatedPlan: Plan) => {
    if (formMode === "edit") {
      await updatePlan(updatedPlan);
      reloadPlans();
    } else if (formMode === "create") {
      await createPlan(updatedPlan);
      reloadPlans();
    }
    setIsFormModalOpen(false);
  };

  const applyFilters = (filters: { field: string; searchValue: string }) => {
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

  const handleDeleteConfirm = async () => {
    if (selectedPlan) {
      await deletePlan(selectedPlan.id);
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
          {t("plans.title", "Planes de suscripción")}
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
            {t("plans.create", "Crear Plan")}
          </Button>
        </Stack>
      </Stack>

      {/* Mostrar spinner cuando está cargando */}
      {loading && <Spinner size="xl" />}

      {/* Mostrar mensaje de error si ocurre */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Mostrar la tabla solo si no hay carga ni error */}
      {!loading && !error && (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>{t("plans.name", "Nombre del Plan")}</Th>
              <Th>{t("plans.description", "Descripción")}</Th>
              <Th>{t("plans.status", "Estado")}</Th>
              <Th>{t("plans.price", "Precio")}</Th>
              <Th>{t("plans.features", "Características")}</Th>
              <Th>{t("plans.details", "Detalles")}</Th>
              <Th>{t("plans.edit", "Editar")}</Th>
              <Th>{t("plans.delete", "Eliminar")}</Th>
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
                  <Badge colorScheme="green">{plan.status}</Badge>
                </Td>
                <Td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(plan.price)}
                </Td>
                <Td>
                  {Array.isArray(plan.features)
                    ? plan.features.join(", ")
                    : plan.features
                    ? plan.features.split(", ").join(", ")
                    : t(
                        "plans.no_features",
                        "No hay características disponibles"
                      )}
                </Td>
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
      )}

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
        itemName={selectedPlan?.name || ""}
      />
    </Box>
  );
};

export default Plans;
