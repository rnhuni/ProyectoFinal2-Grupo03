import { useState } from "react";
import api from '../../api/api';
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
      //console.log("Getting upload URL for", fileName, " - ", contentType);
      const response = await api.post<UploadResponse>("/incident/media/upload-url", {
        file_name: fileName,
        content_type: contentType,
      });
      //console.log("Response", response.data);
      return response.data; // Devuelve la respuesta completa
    } catch (err) {
      // console.error("Get upload URL error:", err);
      const axiosError = err as AxiosError;
      setError(axiosError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar el archivo en la URL generada
  const uploadFile = async (file: File, url: string) => {
    //console.log("En la carga de archivo");
    //console.log("Uploading file", file);
    //console.log("To URL", url);
    setError("");
    setUploadProgress(0);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const bodyForm: any = {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      }
      //console.log("url", url);
      //console.log("bodyForm", bodyForm);

      //console.log("Response antes");
      const response = await fetch(url, bodyForm);
      //console.log("Response", response);
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      return true;
    } catch (err) {
      // console.error("Upload file error:", err);
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
