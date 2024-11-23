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
  Text,
  Checkbox,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  ViewIcon,
  ChatIcon,
  RepeatIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useIncidents from "../hooks/incidents/useIncidents";
import { Incident, IncidentTableData } from "../interfaces/Incidents";
import IncidentFormModal from "../components/Incidents/IncidentFormModal";
import IncidentDetailModal from "../components/Incidents/IncidentDetailModal";
import Chat from "../components/Chat/Chat";
import { useProfileContext } from "../contexts/ProfileContext";
import StatusBadge from "../components/StatusBadge";

const Incidents = () => {
  const { t } = useTranslation();
  const {
    incidents,
    loading,
    error,
    reloadIncidents,
    createIncident,
    updateIncident,
    claimIncident,
    closeIncident,
  } = useIncidents();

  const { profile } = useProfileContext();
  const userRole = profile?.user?.role?.split("-")[1] || "";
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentTableData | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [showChat, setShowChat] = useState(false);
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(
    null
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"assign" | "close" | null>(
    null
  );
  const [incidentToConfirm, setIncidentToConfirm] =
    useState<IncidentTableData | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIncidentForDetails, setSelectedIncidentForDetails] =
    useState<IncidentTableData | null>(null);

  useEffect(() => {
    reloadIncidents();
  }, []);

  const mapIncidentTableDataToIncident = (
    data: IncidentTableData
  ): Incident => {
    return {
      id: data.id,
      type: data.type,
      description: data.description,
      attachments: data.attachments,
      contact: data.contact,
    };
  };

  const handleEdit = (incident: IncidentTableData) => {
    setSelectedIncident(incident);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedIncident(null);
    setIsFormModalOpen(true);
  };

  const handleSave = async (updatedIncident: Incident) => {
    if (formMode === "edit") {
      await updateIncident(updatedIncident);
    } else if (formMode === "create") {
      await createIncident(updatedIncident);
    }

    reloadIncidents();
    setIsFormModalOpen(false);
  };

  const handleViewDetails = (incident: IncidentTableData) => {
    setSelectedIncidentForDetails(incident);
    setIsDetailModalOpen(true);
  };

  const handleOpenChat = (incidentId: string) => {
    setCurrentIncidentId(incidentId);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentIncidentId(null);
  };

  const handleConfirmAction = async () => {
    if (!incidentToConfirm || !confirmAction) return;

    const payload = {
      type: incidentToConfirm.type,
      description: incidentToConfirm.description,
      contact: {
        phone: incidentToConfirm.contact.phone,
      },
    };

    if (confirmAction === "assign") {
      await claimIncident(incidentToConfirm.id, payload);
    } else if (confirmAction === "close") {
      await closeIncident(incidentToConfirm.id, payload);
    }

    setIsConfirmModalOpen(false);
    setIncidentToConfirm(null);
    setConfirmAction(null);
    reloadIncidents();
  };

  const handleAssignClick = (incident: IncidentTableData) => {
    setIncidentToConfirm(incident);
    setConfirmAction("assign");
    setIsConfirmModalOpen(true);
  };

  const handleCloseClick = (incident: IncidentTableData) => {
    setIncidentToConfirm(incident);
    setConfirmAction("close");
    setIsConfirmModalOpen(true);
  };

  const showModalChat = (incidentId: string) => {
    return (
      <Modal isOpen={showChat} onClose={handleCloseChat} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("incidents.chat", "Chat")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat incidentId={incidentId} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseChat}>
              {t("incidents.close_chat", "Close Chat")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
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
          {t("incidents.title", "Gestión de Incidentes")}
        </Text>
        {(userRole === "admin" || userRole === "agent") && (
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={handleCreate}
          >
            {t("incidents.create", "Crear Incidente")}
          </Button>
        )}
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
              <Th>{t("incidents.id", "ID de Incidente")}</Th>
              <Th>{t("incidents.status", "Estado")}</Th>
              <Th>{t("incidents.description", "Descripción")}</Th>
              <Th>{t("incidents.type", "Tipo")}</Th>
              <Th>{t("incidents.user", "Usuario")}</Th>
              <Th>{t("incidents.phone", "Teléfono")}</Th>
              <Th>{t("incidents.createdAt", "Fecha de Creación")}</Th>
              <Th>{t("incidents.actions", "Acciones")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {incidents.map((incident) => (
              <Tr key={incident.id}>
                <Td>
                  <Checkbox />
                </Td>
                <Td>{incident.id}</Td>
                <Td>
                  <StatusBadge
                    status={
                      incident.status?.toLocaleLowerCase() as
                        | "unknown"
                        | "active"
                        | "suspended"
                        | "inactive"
                        | "open"
                        | "closed"
                        | "assigned"
                    }
                  />
                </Td>
                <Td>{incident.description}</Td>
                <Td>{incident.type}</Td>
                <Td>{incident.user_issuer_name}</Td>
                <Td>{incident.contact.phone}</Td>
                <Td>{new Date(incident.createdAt).toLocaleString()}</Td>
                <Td>
                  <Stack direction="row" spacing={2}>
                    <Tooltip label="Ver detalles">
                      <IconButton
                        aria-label="View details"
                        icon={<ViewIcon />}
                        onClick={() => handleViewDetails(incident)}
                      />
                    </Tooltip>
                    <Tooltip label="Editar">
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(incident)}
                      />
                    </Tooltip>
                    {(userRole === "admin" || userRole === "agent") && (
                      <>
                        {!incident.assigned_to_id && (
                          <Tooltip label="Asignar">
                            <IconButton
                              aria-label="Assign"
                              icon={<RepeatIcon />}
                              onClick={() => handleAssignClick(incident)}
                            />
                          </Tooltip>
                        )}
                        {!incident.closed_by_id && (
                          <Tooltip label="Cerrar">
                            <IconButton
                              aria-label="Close"
                              icon={<CheckIcon />}
                              onClick={() => handleCloseClick(incident)}
                            />
                          </Tooltip>
                        )}
                      </>
                    )}
                    <Tooltip label="Chat">
                      <IconButton
                        aria-label="Chat"
                        icon={<ChatIcon />}
                        onClick={() => handleOpenChat(incident.id)}
                      />
                    </Tooltip>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t("confirmation.title", "Confirmación de Acción")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t(
              "confirmation.message",
              "¿Estás seguro de que deseas realizar esta acción?"
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setIsConfirmModalOpen(false)}
            >
              {t("confirmation.cancel", "Cancelar")}
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmAction}>
              {t("confirmation.confirm", "Confirmar")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {currentIncidentId && showModalChat(currentIncidentId)}

      <IncidentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        initialData={
          formMode === "edit" && selectedIncident
            ? mapIncidentTableDataToIncident(selectedIncident)
            : null
        }
        mode={formMode}
      />

      <IncidentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        incident={selectedIncidentForDetails}
      />
    </Box>
  );
};

export default Incidents;
