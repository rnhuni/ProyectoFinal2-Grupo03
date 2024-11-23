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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useActiveSubscription from "../hooks/invoices/useActiveSubscription";
import usePayments from "../hooks/invoices/usePayments";

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();

  const {
    activeSubscription,
    loading: activeLoading,
    error: activeError,
  } = useActiveSubscription();

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
  } = usePayments();

  const downloadPaymentsCSV = () => {
    const csvContent = [
      [
        t("subscription.payment_date"),
        t("subscription.amount_paid"),
        t("subscription.description"),
        t("subscription.status"),
      ],
      ...payments.map((payment) => [
        payment.date,
        payment.amount,
        payment.description,
        payment.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "historial_de_pagos.csv");
    link.click();
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? t("subscription.no_data")
      : parsedDate.toLocaleDateString();
  };

  if (activeLoading || paymentsLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" label={t("subscription.loading")} />
      </Flex>
    );
  }

  if (activeError || paymentsError) {
    return (
      <Box mx="auto" p="6">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {t("subscription.error_loading")}
        </Alert>
      </Box>
    );
  }

  return (
    <Box mx="auto" p="6">
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            {t("subscription.title")}
          </Heading>
        </Flex>

        <Box>
          <Heading as="h2" size="md" mb="2">
            {activeSubscription?.baseName || t("subscription.current_plan")}
          </Heading>
          <Flex align="center" mb="4">
            <Icon as={FaCrown} color="black" boxSize={10} />
            <Box pt={2} pl={4}>
              <Text fontWeight="bold">{activeSubscription?.baseName}</Text>
              <Text color="gray.600">{activeSubscription?.description}</Text>
            </Box>
          </Flex>
        </Box>

        <Box>
          <Text fontWeight="bold">{t("subscription.subscription_date")}</Text>
          <Text mb="4">
            {activeSubscription?.created_at
              ? formatDate(activeSubscription.created_at)
              : t("subscription.no_data")}
          </Text>

          <Text fontWeight="bold">{t("subscription.amount_paid")}</Text>
          <Text mb="4">${activeSubscription?.price.toLocaleString()}</Text>

          <Text fontWeight="bold">{t("subscription.last_update")}</Text>
          <Text mb="4">
            {activeSubscription?.updated_at
              ? formatDate(activeSubscription.updated_at)
              : t("subscription.no_data")}
          </Text>
        </Box>

        <Flex wrap="wrap" gap={6} flexDirection={"column"}>
          <Box flex="1" maxW="900px" mb="6">
            <Heading as="h2" size="md" mb="4">
              {t("subscription.payment_history")}
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
                    <Th>
                      <Checkbox colorScheme="blue" />
                    </Th>
                    <Th>{t("subscription.payment_date")}</Th>
                    <Th>{t("subscription.amount_paid")}</Th>
                    <Th>{t("subscription.description")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {payments?.map((payment) => (
                    <Tr key={payment.id}>
                      <Td>
                        <Checkbox colorScheme="blue" />
                      </Td>
                      <Td>{payment.date}</Td>
                      <Td>${payment.amount.toLocaleString()}</Td>
                      <Td>{payment.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box flex="1" minW="300px" mb="6">
            <Flex align="center">
              <Text fontWeight="bold" mr="4">
                {t("subscription.automatic_notifications")}
              </Text>
              <Switch size="lg" colorScheme="blue" />
            </Flex>
          </Box>
        </Flex>

        <Box>
          <Button leftIcon={<FiDownload />} onClick={downloadPaymentsCSV}>
            {t("subscription.download_csv")}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default SubscriptionPage;
