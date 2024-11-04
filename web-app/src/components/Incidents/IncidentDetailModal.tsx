import React, { useState } from "react";
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
import { IncidentTableData } from "../../interfaces/Incidents";
import apiClient from "../../services/HttpClient";

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
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  const handleDownload = async (attachmentId: string) => {
    setDownloading(true);
    try {
      const response = await apiClient.post("/v1/incident/media/download-url", {
        media_id: attachmentId,
      });

      const downloadUrl = response.data.url;

      // Redirecciona para iniciar la descarga
      window.location.href = downloadUrl;

      toast({
        title: "Descarga iniciada",
        description: "El archivo se está descargando.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error en la descarga",
        description: "No se pudo descargar el archivo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDownloading(false);
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
            {incident.attachments && incident.attachments.length > 0 ? (
              incident.attachments.map((attachment) => (
                <Box key={attachment.id} mb={2}>
                  <Text>{attachment.file_name}</Text>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleDownload(attachment.id)}
                    isLoading={downloading}
                    loadingText="Descargando"
                  >
                    Descargar
                  </Button>
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
