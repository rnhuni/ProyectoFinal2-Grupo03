import { useState, useEffect } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { SubscriptionBase } from "../../interfaces/SubscriptionsBase";

const useSubscriptionBases = () => {
  const [subscriptionBases, setSubscriptionBases] = useState<
    SubscriptionBase[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const service = "/billing/subscriptions/base";

  useEffect(() => {
    const fetchSubscriptionBases = async () => {
      try {
        const response = await httpClient.get<SubscriptionBase[]>(service);
        setSubscriptionBases(response.data);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionBases();
  }, []);

  return { subscriptionBases, loading, error };
};

export default useSubscriptionBases;
