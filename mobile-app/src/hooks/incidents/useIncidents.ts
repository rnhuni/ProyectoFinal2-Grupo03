import { useState } from 'react';
import api, {setToken} from '../../api/api';
import { AxiosError, CanceledError } from 'axios';
import { Incident } from '../../interfaces/Indicents';

const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const service = '/incident/incidents';

  const reloadIncidents = () => {
    setLoading(true);
    setError('');
    console.log('Service URL:', service); // Registrar la URL del servicio en la consola
    api
      .get<Incident[]>(service)
      .then(res => {
        // console.log('API Response:', res.data); // Registrar la respuesta de la API en la consola
        setIncidents(res.data);
      })
      .catch(err => {
        console.error('API Error:', err); // Registrar el error en la consola
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
      setToken("eyJraWQiOiJBNHRnQVBSYVI1aDgxQ1RCYkV2Tk5RU0c0WDRkRkloc0V4SEFMQU9FbCtNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NGQ4ZDRiOC1jMDUxLTcwODUtOWFhMS0yZWE0MDAwOTNhMTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWDRTbFVGMHowIiwiY29nbml0bzp1c2VybmFtZSI6Ijg0ZDhkNGI4LWMwNTEtNzA4NS05YWExLTJlYTQwMDA5M2ExMiIsIm9yaWdpbl9qdGkiOiI0Mjc4NTdlMy0wNDg0LTRhY2YtYjE1Zi1iZGNjZjFjODlhNDAiLCJhdWQiOiI3ZXZqZmp0dnNjbjBxc29rOGxhMmtmMWphIiwiZXZlbnRfaWQiOiJmNWQyY2M5OC1kYWJhLTQ1YmUtYmUyZi05MjExYWNlOGYwZTYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTczMDU4MjY5MiwibmFtZSI6Ik9zY2FyIiwiZXhwIjoxNzMwNjY5MDkyLCJpYXQiOjE3MzA1ODI2OTIsImp0aSI6ImM3NTZmYzZmLTMyNmItNDgzYy05NTYzLTQwMjY0MTcwNDMwMCIsImVtYWlsIjoib2VyYW1pcmV6YkBnbWFpbC5jb20ifQ.CVCx8GSZXhTX4tNkL7tOjBVdb8h5wWreHmnXMQoGRlACnorMY5-4l4o_7fsqsoswjKg4hVOkiesfh3O_HSqzGRhAvB9HKiF9xFvCSSrEaUcl6Xyevtg_qEQEHKnMgXKVgEyYnwNfdu12AeMo3Sc1qUVLNdi-viLcKoea-DQrDxmy-g2zwPgF_08iJ2Dc8xJyL6cwv9eRKighKQm14gfUcxC12uysvtUhfcarpkUoakVN0KEP05ukSGXLIntPNM66xfL6Eh9dFyGPXlqYvq496GOo-VGBv-kmykAjFUUPlDkiJq2BqQZZ_Vot6IVD0wRoOax-VkPlGHUSQMdp0v0vsw");
      const res = await api.post<Incident>(service, newIncident);
      console.log('Create Incident Response:', res.data); // Registrar la respuesta de la API en la consola
      reloadIncidents();
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
      console.log('Update Incident Response:', res.data); // Registrar la respuesta de la API en la consola
      reloadIncidents();
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
