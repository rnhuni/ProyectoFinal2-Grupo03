// src/components/TestHooks.tsx
import { useEffect } from "react";
import useActiveSubscription from "../hooks/invoices/useActiveSubscription";
import useActiveSubscriptionHistory from "../hooks/invoices/useActiveSubscriptionHistory";
import usePeriods from "../hooks/invoices/usePeriods";
import usePayments from "../hooks/invoices/usePayments";
import useSubscriptionBases from "../hooks/invoices/useSubscriptionBases";
import useInvoices from "../hooks/invoices/useInvoices";
import { Box, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import useUpdateActiveSubscription from "../hooks/invoices/useUpdateActiveSubscription";

const TestHooks = () => {
  const {
    updateActiveSubscription,
    loading: updateLoading,
    error: updateError,
    success,
  } = useUpdateActiveSubscription();
  const {
    activeSubscription,
    loading: activeLoading,
    error: activeError,
  } = useActiveSubscription();
  const {
    activeSubscriptionHistory,
    loading: historyLoading,
    error: historyError,
  } = useActiveSubscriptionHistory();
  const {
    periods,
    loading: periodsLoading,
    error: periodsError,
  } = usePeriods();
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
  } = usePayments();
  const {
    subscriptionBases,
    loading: basesLoading,
    error: basesError,
  } = useSubscriptionBases();
  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
  } = useInvoices();

  useEffect(() => {
    // Puedes llamar a las funciones de los hooks aquí si es necesario
    // Por ejemplo, updateActiveSubscription({ ... });
  }, []);

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Test Hooks
      </Text>

      {/* Mostrar estados de useUpdateActiveSubscription */}
      <Text fontWeight="bold">useUpdateActiveSubscription</Text>
      {updateLoading && <Spinner />}
      {updateError && (
        <Alert status="error">
          <AlertIcon />
          {updateError}
        </Alert>
      )}
      {success && (
        <Alert status="success">
          <AlertIcon />
          Success
        </Alert>
      )}

      {/* Mostrar estados de useActiveSubscription */}
      <Text fontWeight="bold">useActiveSubscription</Text>
      {activeLoading && <Spinner />}
      {activeError && (
        <Alert status="error">
          <AlertIcon />
          {activeError}
        </Alert>
      )}
      {activeSubscription && <Text>{JSON.stringify(activeSubscription)}</Text>}

      {/* Mostrar estados de useActiveSubscriptionHistory */}
      <Text fontWeight="bold">useActiveSubscriptionHistory</Text>
      {historyLoading && <Spinner />}
      {historyError && (
        <Alert status="error">
          <AlertIcon />
          {historyError}
        </Alert>
      )}
      {activeSubscriptionHistory && (
        <Text>{JSON.stringify(activeSubscriptionHistory)}</Text>
      )}

      {/* Mostrar estados de usePeriods */}
      <Text fontWeight="bold">usePeriods</Text>
      {periodsLoading && <Spinner />}
      {periodsError && (
        <Alert status="error">
          <AlertIcon />
          {periodsError}
        </Alert>
      )}
      {periods && <Text>{JSON.stringify(periods)}</Text>}

      {/* Mostrar estados de usePayments */}
      <Text fontWeight="bold">usePayments</Text>
      {paymentsLoading && <Spinner />}
      {paymentsError && (
        <Alert status="error">
          <AlertIcon />
          {paymentsError}
        </Alert>
      )}
      {payments && <Text>{JSON.stringify(payments)}</Text>}

      {/* Mostrar estados de useSubscriptionBases */}
      <Text fontWeight="bold">useSubscriptionBases</Text>
      {basesLoading && <Spinner />}
      {basesError && (
        <Alert status="error">
          <AlertIcon />
          {basesError}
        </Alert>
      )}
      {subscriptionBases && <Text>{JSON.stringify(subscriptionBases)}</Text>}

      {/* Mostrar estados de useInvoices */}
      <Text fontWeight="bold">useInvoices</Text>
      {invoicesLoading && <Spinner />}
      {invoicesError && (
        <Alert status="error">
          <AlertIcon />
          {invoicesError}
        </Alert>
      )}
      {invoices && <Text>{JSON.stringify(invoices)}</Text>}
    </Box>
  );
};

export default TestHooks;
