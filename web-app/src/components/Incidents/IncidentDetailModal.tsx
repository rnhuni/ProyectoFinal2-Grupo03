import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { IncidentTableData, Attachment } from "../../interfaces/Incidents";
import apiClient from "../../services/HttpClient";
import DownloadAttachment from "../DownloadAttachment";

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentTableData | null;
}

const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && incident) {
      fetchAttachments();
    }
  }, [isOpen, incident]);

  const fetchAttachments = async () => {
    if (!incident) return;
    setLoadingAttachments(true);
    try {
      const token = localStorage.getItem("id_token");
      const response = await apiClient.get(
        `/incident/incidents/${incident.id}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttachments(response.data);
    } catch {
      toast({
        title: "Error al obtener los archivos adjuntos",
        description: "No se pudieron cargar los archivos adjuntos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingAttachments(false);
    }
  };

  if (!incident) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Incidente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold">ID:</Text>
            <Text>{incident.id}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Descripción:</Text>
            <Text>{incident.description}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Tipo:</Text>
            <Text>{incident.type}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Usuario:</Text>
            <Text>{incident.user_issuer_name}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Teléfono:</Text>
            <Text>{incident.contact.phone}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Fecha de Creación:</Text>
            <Text>{new Date(incident.createdAt).toLocaleString()}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Archivos Adjuntos:</Text>
            {loadingAttachments ? (
              <Text>Cargando archivos adjuntos...</Text>
            ) : attachments && attachments.length > 0 ? (
              attachments.map((attachment) => (
                <Box key={attachment.id} mb={2}>
                  <Text>{attachment.file_name}</Text>
                  <DownloadAttachment
                    attachmentInfo={attachment}
                    incidentId={incident.id}
                  />
                </Box>
              ))
            ) : (
              <Text>No hay archivos adjuntos</Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IncidentDetailModal;
