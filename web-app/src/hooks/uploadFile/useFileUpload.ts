import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError } from "axios";

interface UploadResponse {
  content_type: string;
  media_id: string;
  media_name: string;
  upload_url: string;
}

const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Función para obtener la URL de carga
  const getUploadUrl = async (fileName: string, contentType: string) => {
    setError("");
    setLoading(true);
    try {
      const response = await httpClient.post<UploadResponse>("/incident/media/upload-url", {
        file_name: fileName,
        content_type: contentType,
      });
      return response.data; // Devuelve la respuesta completa
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar el archivo en la URL generada
  const uploadFile = async (file: File, url: string) => {
    setError("");
    setUploadProgress(0);
    setLoading(true);
    try {
      await httpClient.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(percentCompleted);
        },
      });
      return true;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    getUploadUrl,
    uploadFile,
    uploadProgress,
    loading,
    error,
  };
};

export default useFileUpload;
