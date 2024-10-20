import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Role } from "../../interfaces/Role";

const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const service = "/system/roles";

  const reloadRoles = () => {

    httpClient
      .get<Role[]>(service)
      .then((res) => {
        console.log(res);
        setRoles(res.data);
      })

      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

  };

  const createRole = async (newRole: Role) => {
    setLoading(true);

    try {
      const res = await httpClient.post<Role | string>(service, newRole);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (aRole: Role) => {
    setLoading(true);

    try {
      const res = await httpClient.put<Role>(service + `/${aRole.id}`, aRole);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };


  return { roles, loading, error, reloadRoles, createRole, updateRole };
};

export default useRoles;
