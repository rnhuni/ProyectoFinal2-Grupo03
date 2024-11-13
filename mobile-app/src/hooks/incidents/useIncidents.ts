import { useState } from 'react';
import api from '../../api/api';
import { AxiosError, CanceledError } from 'axios';
import { Incident } from '../../interfaces/Incidents';

const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const service = '/incident/incidents';

  const reloadIncidents = () => {
    setLoading(true);
    setError('');
    api
      .get<Incident[]>(service)
      .then(res => {
// console.log("Incidents", res.data);

        const sortedIncidents = res.data.sort((a: Incident, b: Incident) => {
          // console.log("Incident A", a.created_at);
          // console.log("Incident B", b.created_at);
          const dateA = new Date(a.created_at || '').getTime();
          const dateB = new Date(b.created_at || '').getTime();
          // console.log("Date A", dateA);
          // console.log("Date B", dateB);
          
          return dateA - dateB; // Orden ascendente
          // Para orden descendente usa `dateB - dateA`
        });
// console.log("Sorted Incidents", sortedIncidents);
        setIncidents(sortedIncidents);
      })
      .catch(err => {
        if (err instanceof CanceledError) {
          return;
        }
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const createIncident = async (newIncident: Incident) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post<Incident>(service, newIncident);
      return res.data;
    } catch (err) {
      console.error('Create Incident Error:', err); // Registrar el error en la consola
      if (err instanceof CanceledError) {
        return;
      }
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateIncident = async (incident: Incident) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put<Incident>(
        `${service}/${incident.id}`,
        incident,
      );
      return res.data;
    } catch (err) {
      console.error('Update Incident Error:', err); // Registrar el error en la consola
      if (err instanceof CanceledError) {
        return;
      }
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
