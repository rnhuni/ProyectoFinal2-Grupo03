
// sonar.ignore
/* istanbul ignore file */
import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Invoice } from "../../interfaces/Invoice";

const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/invoices/asdaedwe2w34234234234";

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await httpClient.get<Invoice[]>(service);
        setInvoices(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return { invoices, loading, error };
};

export default useInvoices;
