
// sonar.ignore
/* istanbul ignore file */
import { useState } from "react";
import apiClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Message } from "../../interfaces/Messages";
import { LoadSession } from "../../interfaces/LoadSessions";
import { CreateSession } from "../../interfaces/CreateSession";

const useChannels = () => {
  const channel_id = "chan-support-channel";
  const [messages, setMessages] = useState<Message[]>([]);
  const [incidentSession, setIncidentSession] = useState<
    LoadSession | CreateSession | null
  >(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadIncidentSession = async (
    Id: string
  ): Promise<LoadSession | undefined> => {
    const filterByTopicRefId = (
      incidents: LoadSession[],
      topicRefId: string
    ): LoadSession[] => {
      return incidents.filter(
        (incident) => incident.topic_refid === topicRefId
      );
    };

    const url = `/channel/channels/${channel_id}/sessions`;

    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get<LoadSession[]>(url);
      const filteredIncidents = filterByTopicRefId(res.data, Id);
      setIncidentSession(filteredIncidents[0]);
      return filteredIncidents[0];
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadMessages = async (id_session?: string): Promise<Message[]> => {
    const session_id = id_session || incidentSession?.id;
    if (!session_id) return [];

    const loadMessages = `/channel/sessions/${session_id}/messages`;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get<Message[]>(loadMessages);
      setMessages(res.data);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return [];
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
    return [];
  };

  const createIncidentSession = async (Id: string) => {
    setLoading(true);
    setError("");
    const createSession = `/channel/channels/${channel_id}/sessions`;
    try {
      const data = {
        topic: "incident",
        topic_refid: Id,
      };
      const res = await apiClient.post<CreateSession>(createSession, data);
      setIncidentSession(res.data);
      return res.data.id;
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const createIncidentMessage = async (message: string) => {
    const session_id = incidentSession?.id;
    if (!session_id) return;

    const url = `/channel/sessions/${session_id}/messages`;
    try {
      const data = {
        content_type: "text/plain",
        body: message,
      };
      const res = await apiClient.post<Message>(url, data);
      setMessages((prevMessages) => [...prevMessages, res.data]);
    } catch (err) {
      if (err instanceof CanceledError) return;
      const axiosError = err as AxiosError;
      setError(axiosError.message);
    }
  };

  return {
    messages,
    loading,
    error,
    incidentSession,
    loadIncidentSession,
    reloadMessages,
    createIncidentSession,
    createIncidentMessage,
  };
};

export default useChannels;
