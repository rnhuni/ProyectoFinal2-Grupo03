import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { CanceledError } from "axios";
import { Permission } from "../../interfaces/Permissions";

const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState("");

  const reloadPermissions = () => {
    const controller = new AbortController();

    httpClient
      .get<Permission[]>("/system/permissions", { signal: controller.signal })
      .then((res) => {
        console.log(res);
        setPermissions(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    reloadPermissions(); // Carga inicial de permisos
  }, []);

   return { permissions, error, reloadPermissions }; // Retornamos reloadPermissions
};

export default usePermissions;
