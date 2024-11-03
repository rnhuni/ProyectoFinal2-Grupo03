import { CanceledError, AxiosError } from "axios";
import httpClient from "../../services/HttpClient";
import { useState, useEffect } from "react";
import { Period } from "../../interfaces/Periods";


const usePeriods = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/periods";

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await httpClient.get<Period[]>(service);
        setPeriods(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, []);

  return { periods, loading, error };
};

export default usePeriods;
