import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { DownloadAttachmentProps } from "../interfaces/DownloadAttachmentProps";
import apiClient from "../services/HttpClient";

const DownloadAttachment: React.FC<DownloadAttachmentProps> = ({
  attachmentInfo,
  incidentId,
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const downloadFile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/incident/incidents/${incidentId}/attachments/${attachmentInfo.id}`
      );

      const downloadUrl = response.data.url;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = attachmentInfo.file_name || "archivo-descargado";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Descarga iniciada",
        description: "El archivo se está descargando.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error en la descarga",
        description: "No se pudo descargar el archivo. Inténtelo nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      colorScheme="teal"
      onClick={downloadFile}
      isLoading={loading}
      loadingText="Descargando"
    >
      Descargar Archivo
    </Button>
  );
};

export default DownloadAttachment;
