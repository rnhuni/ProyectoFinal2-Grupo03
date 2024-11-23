// Incidents.js
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
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChatIcon,
} from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useIncidents from "../hooks/incidents/useIncidents";
import { Incident, IncidentTableData } from "../interfaces/Incidents";
import IncidentFormModal from "../components/Incidents/IncidentFormModal.tsx";
import IncidentDetailModal from "../components/Incidents/IncidentDetailModal.tsx";
import Chat from "../components/Chat/Chat.tsx";

const Incidents = () => {
  const { t } = useTranslation();
  const {
    incidents,
    loading,
    error,
    reloadIncidents,
    createIncident,
    updateIncident,
  } = useIncidents();

  const [filteredIncidents, setFilteredIncidents] = useState<
    IncidentTableData[]
  >([]);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentTableData | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [showChat, setShowChat] = useState(false);
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(
    null
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIncidentForDetails, setSelectedIncidentForDetails] =
    useState<IncidentTableData | null>(null);

  useEffect(() => {
    reloadIncidents();
  }, []);

  useEffect(() => {
    setFilteredIncidents(incidents);
  }, [incidents]);

  // Función para mapear IncidentTableData a Incident
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

  const showModalChat = (incidentId: string) => {
    return (
      <Modal isOpen={showChat} onClose={handleCloseChat} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat incidentId={incidentId} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseChat}>Close Chat</Button>
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
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          {t("incidents.create", "Crear Incidente")}
        </Button>
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
              <Th>{t("incidents.description", "Descripción")}</Th>
              <Th>{t("incidents.type", "Tipo")}</Th>
              <Th>{t("incidents.user", "Usuario")}</Th>
              <Th>{t("incidents.phone", "Teléfono")}</Th>
              <Th>{t("incidents.createdAt", "Fecha de Creación")}</Th>
              <Th>{t("incidents.details", "Detalles")}</Th>
              <Th>{t("incidents.edit", "Editar")}</Th>
              <Th>{t("incidents.delete", "Eliminar")}</Th>
              <Th>{t("incidents.chat", "Chat")}</Th>
              <Th>{t("incidents.assign", "Asignar")}</Th>
              <Th>{t("incidents.close", "Cerrar")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredIncidents.map((incident) => (
              <Tr key={incident.id}>
                <Td>
                  <Checkbox />
                </Td>
                <Td>{incident.id}</Td>
                <Td>{incident.description}</Td>
                <Td>{incident.type}</Td>
                <Td>{incident.user_issuer_name}</Td>
                <Td>{incident.contact.phone}</Td>
                <Td>{new Date(incident.createdAt).toLocaleString()}</Td>
                <Td>
                  <IconButton
                    aria-label="View details"
                    icon={<ViewIcon />}
                    onClick={() => handleViewDetails(incident)}
                    variant="ghost"
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit incident"
                    icon={<EditIcon />}
                    onClick={() => handleEdit(incident)}
                    variant="ghost"
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Delete incident"
                    icon={<DeleteIcon />}
                    onClick={() => console.log("Delete Incident")}
                    variant="ghost"
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Open Chat"
                    icon={<ChatIcon />}
                    variant="ghost"
                    onClick={() => handleOpenChat(incident.id)}
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Assign"
                    icon={<ChatIcon />}
                    variant="ghost"
                    onClick={() => {}}
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Close"
                    icon={<ChatIcon />}
                    variant="ghost"
                    onClick={() => {}}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
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
