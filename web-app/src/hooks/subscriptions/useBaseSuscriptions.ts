import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import {
  BaseSubscription,
  NewSubscriptionData,
} from "../../interfaces/SubscriptionsBase";

const useBaseSubscriptions = () => {
  const [baseSubscriptions, setBaseSubscriptions] = useState<
    BaseSubscription[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const service = "/billing/subscriptions/base";

  const reloadBaseSubscriptions = () => {
    setLoading(true);
    httpClient
      .get<BaseSubscription[]>(service)
      .then((res) => {
        setBaseSubscriptions(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const createBaseSubscription = async (
    newSubscriptionData: NewSubscriptionData
  ) => {
    setLoading(true);
    try {
      const res = await httpClient.post<BaseSubscription>(
        `${service}/active`,
        newSubscriptionData
      );
      setBaseSubscriptions((prevSubscriptions) => [
        ...prevSubscriptions,
        res.data,
      ]);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBaseSubscription = async (
    updatedSubscription: BaseSubscription
  ) => {
    setLoading(true);
    try {
      const res = await httpClient.put<BaseSubscription>(
        `${service}/${updatedSubscription.id}`,
        updatedSubscription
      );
      setBaseSubscriptions((prevSubscriptions) =>
        prevSubscriptions.map((subscription) =>
          subscription.id === updatedSubscription.id ? res.data : subscription
        )
      );
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    baseSubscriptions,
    loading,
    error,
    reloadBaseSubscriptions,
    createBaseSubscription,
    updateBaseSubscription,
  };
};

export default useBaseSubscriptions;
