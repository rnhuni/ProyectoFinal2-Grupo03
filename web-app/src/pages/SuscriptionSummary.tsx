// sonar.ignore
/* istanbul ignore file */
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsIcon } from "@chakra-ui/icons";
import useClients from "../hooks/clients/useClients";
import PlanAssignmentPage from "./PlanAssignmentPage";
import { Client } from "../interfaces/Client";

const SuscriptionSummary = () => {
  const { t } = useTranslation();
  const { clients, loading, error, reloadClients } = useClients();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleUpdatePlan = (client: Client) => {
    setSelectedClient(client);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    reloadClients();
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
          {t("subscription.title", "Suscripción y Detalles de Clientes")}
        </Text>
      </Stack>

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && clients.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("subscription.user_name", "Nombre del Cliente")}</Th>
              <Th>{t("subscription.current_plan", "Plan Actual")}</Th>
              <Th>
                {t("subscription.subscription_date", "Fecha de Creación")}
              </Th>
              <Th>{t("subscription.update_plan", "Actualizar Plan")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>{client.subscription_plan.name}</Td>
                <Td>
                  {new Date(client.created_at).toLocaleDateString("es-ES")}
                </Td>
                <Td>
                  <Button
                    leftIcon={<SettingsIcon />}
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleUpdatePlan(client)}
                  >
                    {t("subscription.update_plan", "Actualizar")}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedClient && (
              <PlanAssignmentPage
                client={selectedClient}
                onClose={handleCloseModal}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SuscriptionSummary;
