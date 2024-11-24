// sonar.ignore
/* istanbul ignore file */
import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Payment } from "../../interfaces/Payments";

const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/payments";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await httpClient.get<Payment[]>(service);
        setPayments(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { payments, loading, error };
};

export default usePayments;
