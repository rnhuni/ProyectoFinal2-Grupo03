import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Incident, IncidentTableData } from "../../interfaces/Incidents";
import { useProfileContext } from "../../contexts/ProfileContext";


const useIncidents = () => {
  const { profile } = useProfileContext();
  const [incidents, setIncidents] = useState<IncidentTableData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const service = "/incident/incidents";

  const reloadIncidents = () => {
    setLoading(true);
    setError("");
  
    const role = profile?.user?.role?.split("-")[1] || "";
    const userId = profile?.user?.id || "";
    let endpoint = service;
  
    if (role !== "admin" && userId) {
      endpoint = `${service}?user_issuer=${userId}`;
    }
  
    httpClient
      .get<IncidentTableData[]>(endpoint)
      .then((res) => {
        setIncidents(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };
  

  const createIncident = async (newIncident: Incident) => {
    setLoading(true);
    setError("");
    try {
      const res = await httpClient.post<Incident>(service, newIncident);
      await reloadIncidents();
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateIncident = async (incident: Incident) => {
    setLoading(true);
    setError("");
    try {
      const res = await httpClient.put<Incident>(
        `${service}/${incident.id}`,
        incident
      );
      reloadIncidents();
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const claimIncident = async (incidentId: string, payload: Incident) => {
    setLoading(true);
    setError("");
    try {
      const res = await httpClient.put<Incident>(
        `${service}/${incidentId}/claim`,
        payload
      );
      reloadIncidents();
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };
  
  const closeIncident = async (incidentId: string, payload: Incident) => {
    setLoading(true);
    setError("");
    try {
      const res = await httpClient.put<Incident>(
        `${service}/${incidentId}/close`,
        payload
      );
      reloadIncidents();
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
    incidents,
    loading,
    error,
    reloadIncidents,
    createIncident,
    updateIncident,
    claimIncident,
    closeIncident
  };
};

export default useIncidents;
