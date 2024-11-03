import { CanceledError, AxiosError } from "axios";
import httpClient from "../../services/HttpClient";
import { useState, useEffect } from "react";
import { ActivePeriod } from "../../interfaces/ActivePeriod";


const useActivePeriod = () => {
  const [activePeriod, setActivePeriod] = useState<ActivePeriod | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/periods/active";

  useEffect(() => {
    const fetchActivePeriod = async () => {
      try {
        const response = await httpClient.get<ActivePeriod>(service);
        setActivePeriod(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePeriod();
  }, []);

  return { activePeriod, loading, error };
};

export default useActivePeriod;
