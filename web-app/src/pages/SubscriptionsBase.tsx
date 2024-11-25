// sonar.ignore
/* istanbul ignore file */
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
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import PlanFilterDrawer from "../components/Plans/PlanFilterDrawer";
import SubscriptionActiveModal from "../components/Subscriptions/SubscriptionActiveModal";
import useBaseSubscriptions from "../hooks/subscriptions/useBaseSuscriptions";
import {
  BaseSubscription,
  NewSubscriptionData,
} from "../interfaces/SubscriptionsBase";

const SubscriptionsBase = () => {
  const { t } = useTranslation();

  const {
    baseSubscriptions,
    loading,
    error,
    reloadBaseSubscriptions,
    createBaseSubscription,
    updateBaseSubscription,
  } = useBaseSubscriptions();

  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    BaseSubscription[]
  >([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<BaseSubscription | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false); // Estado para el modal
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    reloadBaseSubscriptions();
  }, []);

  useEffect(() => {
    setFilteredSubscriptions(baseSubscriptions);
  }, [baseSubscriptions]);

  const handleOpenSubscriptionModal = (subscription?: BaseSubscription) => {
    if (subscription) {
      setSelectedSubscription(subscription);
      setFormMode("edit");
    } else {
      setSelectedSubscription(null);
      setFormMode("create");
    }
    setIsSubscriptionModalOpen(true);
  };

  const handleSaveSubscription = async (
    subscriptionData: Partial<BaseSubscription> | NewSubscriptionData
  ) => {
    if (formMode === "edit" && selectedSubscription) {
      await updateBaseSubscription({
        ...selectedSubscription,
        ...subscriptionData,
      } as BaseSubscription);
    } else {
      const newSubscriptionData: NewSubscriptionData = {
        notifyByEmail:
          "notifyByEmail" in subscriptionData
            ? subscriptionData.notifyByEmail
            : false,
        subscriptionBaseId:
          "subscriptionBaseId" in subscriptionData
            ? subscriptionData.subscriptionBaseId
            : "",
        features:
          subscriptionData.features?.map((feature) => feature.toString()) ?? [],
      };
      await createBaseSubscription(newSubscriptionData);
    }
    reloadBaseSubscriptions();
    setIsSubscriptionModalOpen(false);
  };

  const applyFilters = (filters: { field: string; searchValue: string }) => {
    const { field, searchValue } = filters;
    if (!searchValue) {
      setFilteredSubscriptions(baseSubscriptions);
      return;
    }

    const filtered = baseSubscriptions.filter((subscription) => {
      const fieldValue = subscription[field as keyof BaseSubscription]
        ?.toString()
        .toLowerCase();
      return fieldValue?.includes(searchValue.toLowerCase());
    });

    setFilteredSubscriptions(filtered);
  };

  const clearFilters = () => {
    setFilteredSubscriptions(baseSubscriptions);
  };

  const isFiltered = filteredSubscriptions.length !== baseSubscriptions.length;

  return (
    <Box p={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {t("subscriptions.title", "Planes de suscripción")}
        </Text>
        <Stack direction="row" spacing={4}>
          {/* Drawer de filtros */}
          <PlanFilterDrawer applyFilters={applyFilters} />
          {isFiltered && (
            <Button colorScheme="gray" variant="outline" onClick={clearFilters}>
              {t("subscriptions.clear_filters", "Limpiar Filtros")}
            </Button>
          )}
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={() => handleOpenSubscriptionModal()}
          >
            {t("subscriptions.create", "Crear Suscripción")}
          </Button>
        </Stack>
      </Stack>

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>{t("subscriptions.name", "Nombre del Plan")}</Th>
              <Th>{t("subscriptions.status", "Estado")}</Th>
              <Th>{t("subscriptions.price", "Precio")}</Th>
              <Th>{t("subscriptions.edit", "Editar")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSubscriptions.map((subscription) => (
              <Tr key={subscription.id}>
                <Td>
                  <Checkbox />
                </Td>
                <Td fontWeight="bold">{subscription.name}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      subscription.status === "active" ? "green" : "yellow"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </Td>
                <Td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(subscription.price)}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit subscription"
                    icon={<EditIcon />}
                    onClick={() => handleOpenSubscriptionModal(subscription)}
                    variant="ghost"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal para Crear/Editar Suscripción Activa */}
      <SubscriptionActiveModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSave={handleSaveSubscription}
        subscription={formMode === "edit" ? selectedSubscription : null}
      />
    </Box>
  );
};

export default SubscriptionsBase;
