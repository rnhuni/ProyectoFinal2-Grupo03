// sonar.ignore
/* istanbul ignore file */
import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { ActiveSubscriptionHistory } from "../../interfaces/SubscriptionsBase";


const useActiveSubscriptionHistory = () => {
  const [activeSubscriptionHistory, setActiveSubscriptionHistory] = useState<
    ActiveSubscriptionHistory[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/subscriptions/active/history";

  useEffect(() => {
    const fetchActiveSubscriptionHistory = async () => {
      try {
        const response = await httpClient.get<ActiveSubscriptionHistory[]>(
          service
        );
        setActiveSubscriptionHistory(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSubscriptionHistory();
  }, []);

  return { activeSubscriptionHistory, loading, error };
};

export default useActiveSubscriptionHistory;
