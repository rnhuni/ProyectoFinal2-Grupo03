import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SettingsIcon } from "@chakra-ui/icons";
import StatusBadge from "../components/StatusBadge";

// Interface para los detalles de suscripción
interface Subscription {
  id: number;
  userName: string;
  currentPlan: string;
  description: string;
  subscriptionDate: string;
  amountPaid: number;
  nextBillingDate: string;
  status: "active" | "inactive" | "suspended";
}

// Hook simulado para obtener los detalles de suscripciones
const useSubscriptionDetails = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de llamada a API
    setTimeout(() => {
      setSubscriptions([
        {
          id: 1,
          userName: "Juan Pérez",
          currentPlan: "Plan Pro",
          description:
            "Ofrece todas las funciones avanzadas, soporte prioritario y recursos adicionales.",
          subscriptionDate: "01/01/2024",
          amountPaid: 85000,
          nextBillingDate: "01/31/2024",
          status: "active",
        },
        {
          id: 2,
          userName: "María López",
          currentPlan: "Plan Básico",
          description: "Incluye funciones básicas para usuarios individuales.",
          subscriptionDate: "01/01/2024",
          amountPaid: 30000,
          nextBillingDate: "01/31/2024",
          status: "inactive",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { subscriptions, loading, error };
};

const SuscriptionSummary = () => {
  const { t } = useTranslation();
  const { subscriptions, loading, error } = useSubscriptionDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  // Formato para fechas y moneda
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleUpdatePlan = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  return (
    <Box p={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {t("subscription.title", "Suscripción y Detalles de Pago")}
        </Text>
      </Stack>

      {loading && <Spinner size="xl" />}

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Mostrar la tabla de detalles de suscripción */}
      {!loading && !error && subscriptions.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("subscription.user_name", "Nombre del Usuario")}</Th>
              <Th>{t("subscription.current_plan", "Plan Actual")}</Th>
              <Th>
                {t("subscription.subscription_date", "Fecha de Suscripción")}
              </Th>
              <Th>{t("subscription.amount_paid", "Monto Pagado")}</Th>
              <Th>
                {t(
                  "subscription.next_billing_date",
                  "Próxima Fecha de Facturación"
                )}
              </Th>
              <Th>{t("subscription.status", "Estado")}</Th>
              <Th>{t("subscription.update_plan", "Actualizar Plan")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptions.map((subscription) => (
              <Tr key={subscription.id}>
                <Td>{subscription.userName}</Td>
                <Td>
                  <Text fontWeight="bold">{subscription.currentPlan}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {subscription.description}
                  </Text>
                </Td>
                <Td>{formatDate(subscription.subscriptionDate)}</Td>
                <Td>{formatCurrency(subscription.amountPaid)}</Td>
                <Td>{formatDate(subscription.nextBillingDate)}</Td>
                <Td>
                  <StatusBadge status={subscription.status} />
                </Td>
                <Td>
                  <Button
                    leftIcon={<SettingsIcon />}
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleUpdatePlan(subscription)}
                  >
                    {t("subscription.update_plan", "Actualizar")}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default SuscriptionSummary;
