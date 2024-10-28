import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Incident, IncidentTableData } from "../../interfaces/Indicents";


const useIncidents = () => {
  const [incidents, setIncidents] = useState<IncidentTableData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const service = "/incident/incidents";

  const reloadIncidents = () => {
    setLoading(true);
    setError("");
    httpClient
      .get<IncidentTableData[]>(service)
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

  return {
    incidents,
    loading,
    error,
    reloadIncidents,
    createIncident,
    updateIncident,
  };
};

export default useIncidents;
