import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Plan } from "../../interfaces/Plan"; // Asegúrate de importar la interfaz Plan

const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null); // Estado para almacenar un solo plan
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

  const assignPlanToClient = async (
    clientId: string,
    subscriptionId: string
  ) => {
    setLoading(true);

    const serviceClients = "/system/clients";

    try {
      const res = await httpClient.put(`${serviceClients}/${clientId}`, {
        subscription_id: subscriptionId,
      });
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  // Método para obtener un plan específico por su ID
  const getPlanById = (planId: string) => {
    setLoading(true);
    setError(""); // Limpiar errores previos

    httpClient
      .get<Plan>(`${service}/${planId}`) // Llamada al endpoint con el ID del plan
      .then((res) => {
        setPlan(res.data); // Guardar el plan obtenido en el estado `plan`
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        const axiosError = err as AxiosError;
        setError(axiosError.message); // Guardar el mensaje de error en caso de fallo
      })
      .finally(() => setLoading(false));
  };

  return {
    plans,
    plan, // Agregar `plan` en el retorno para poder usarlo fuera del hook
    loading,
    error,
    reloadPlans,
    createPlan,
    updatePlan,
    deletePlan,
    assignPlanToClient,
    getPlanById,
  };
};

export default usePlans;
