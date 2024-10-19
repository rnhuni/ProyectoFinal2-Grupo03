import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { CanceledError, AxiosError } from "axios";
import { Permission } from "../../interfaces/Permissions";

const useOperationsPermission = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createPermission = async (newPermission: Permission) => {
    setLoading(true); // Inicia el estado de carga

    try {
      const res = await httpClient.post<Permission>("/system/permissions", newPermission);
      return res.data; // Retorna el nuevo permiso creado
    } catch (err) {
      if (err instanceof CanceledError) return;

      // Verificar si el error es de Axios
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const updatePermission = async (aPermission: Permission) => {
    setLoading(true); 

    try {
      const res = await httpClient.put<Permission>(`/system/permissions/${aPermission.id}`, aPermission);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false); 
    }
  };

  return { createPermission, updatePermission, error, loading };
};

export default useOperationsPermission;
