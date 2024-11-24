// sonar.ignore
/* istanbul ignore file */
import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { ActiveSubscription } from "../../interfaces/SubscriptionsBase";


const useActiveSubscription = () => {
  const [activeSubscription, setActiveSubscription] =
    useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/subscriptions/active";

  useEffect(() => {
    const fetchActiveSubscription = async () => {
      try {
        const response = await httpClient.get<ActiveSubscription>(service);
        setActiveSubscription(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSubscription();
  }, []);

  return { activeSubscription, loading, error };
};

export default useActiveSubscription;
