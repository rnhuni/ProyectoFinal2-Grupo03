import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Plan } from "../../interfaces/Plan"; // Asegúrate de importar la interfaz Plan

const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const service = "/system/subscriptions"; // Cambia el endpoint según tu backend

  const reloadPlans = () => {
    setLoading(true);

    httpClient
      .get<Plan[]>(service)
      .then((res) => {
        setPlans(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const createPlan = async (newPlan: Plan) => {
    setLoading(true);

    try {
      const res = await httpClient.post<Plan>(service, newPlan);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (updatedPlan: Plan) => {
    setLoading(true);
    try {
      const res = await httpClient.put<Plan>(
        `${service}/${updatedPlan.id}`,
        updatedPlan
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

  const deletePlan = async (planId: string) => {
    setLoading(true);

    try {
      await httpClient.delete(`${service}/${planId}`);
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    reloadPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

export default usePlans;
