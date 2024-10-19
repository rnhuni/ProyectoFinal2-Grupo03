import { useState, useEffect } from "react";
import httpClient from "../services/HttpClient"; // Reemplaza el import con el nuevo cliente
import { CanceledError } from "axios";
import { Role } from "../interfaces/Role";

const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    httpClient
      .get<Role[]>("/system/roles", { signal: controller.signal }) // Cambia el endpoint a "/roles"
      .then((res) => {
        console.log(res);
        setRoles(res.data);
      })

      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, []);

  return { roles, error };
};

export default useRoles;
