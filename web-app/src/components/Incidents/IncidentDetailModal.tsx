import React from "react";
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
} from "@chakra-ui/react";
import { IncidentTableData } from "../../interfaces/Incidents";

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
                    onClick={() => {
                      console.log(
                        `Descargando archivo: ${attachment.file_name}`
                      );
                    }}
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
