// sonar.ignore
/* istanbul ignore file */
import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { UpdateActiveSubscriptionData } from "../../interfaces/SubscriptionsBase";


const useUpdateActiveSubscription = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const service = "/billing/subscriptions/active";

  const updateActiveSubscription = async (
    data: UpdateActiveSubscriptionData
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await httpClient.put(service, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof CanceledError) return;
      setError((err as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  return { updateActiveSubscription, loading, error, success };
};

export default useUpdateActiveSubscription;
