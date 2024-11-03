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
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useIncidents from "../hooks/incidents/useIncidents";
import { Incident, IncidentTableData } from "../interfaces/Incidents";
import IncidentFormModal from "../components/Incidents/IncidentFormModal";

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

  useEffect(() => {
    reloadIncidents();
  }, []);

  useEffect(() => {
    setFilteredIncidents(incidents);
  }, [incidents]);

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
                    onClick={() => console.log("View Details")}
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

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
    </Box>
  );
};

export default Incidents;
