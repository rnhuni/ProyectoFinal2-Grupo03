import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Client } from "../../interfaces/Client";

const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const service = "/system/clients";

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<Client[]>(service);
      setClients(response.data);
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const reloadClients = async () => {
    await fetchClients();
  };

  return {
    clients,
    loading,
    error,
    reloadClients,
  };
};

export default useClients;
