import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Permission } from "../../interfaces/Permissions";

const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const service = "/system/permissions";

  const reloadPermissions = () => {

    httpClient
      .get<Permission[]>("/system/permissions")
      .then((res) => {
        console.log(res);
        setPermissions(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

  };

  const createPermission = async (newPermission: Permission) => {
    setLoading(true);

    try {
      const res = await httpClient.post<Permission>(service, newPermission);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (aPermission: Permission) => {
    setLoading(true);

    try {
      const res = await httpClient.put<Permission>(service + `/${aPermission.id}`, aPermission);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return { permissions, loading, error, reloadPermissions, updatePermission, createPermission };
};

export default usePermissions;
