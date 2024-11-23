import { useState } from "react";
import api from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { NotificationConfig } from "../../interfaces/NotificationConfig";

const useNotificationConfig = () => {
  const [notificationsConfig, setNotificationsConfig] = useState<
    NotificationConfig[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const service = "/system/notifications";

  const reloadNotificationConfig = async (): Promise<NotificationConfig[]> => {
    setLoading(true);
    setError("");
    let sortedData: NotificationConfig[] = [];
    await api
      .get<NotificationConfig[]>(service)
      .then((res) => {
        sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setNotificationsConfig(sortedData);

        console.log("Notifications Config response:", res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) {
          return;
        }
        setError(err.message);
      })
      .finally(() => setLoading(false));
    return sortedData;
  };

  const updateNotificationConfig = async (
    notificationConfig: NotificationConfig
  ) => {
    setLoading(true);
    setError("");
    try {
      // console.log('Update notificationConfig:', notificationConfig);
      const res = await api.put<NotificationConfig>(
        `${service}/${notificationConfig.id}`,
        notificationConfig
      );
      return res.data;
    } catch (err) {
      console.error("Update notificationConfig Error:", err); // Registrar el error en la consola
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
    notificationsConfig,
    loading,
    error,
    reloadNotificationConfig,
    updateNotificationConfig,
  };
};

export default useNotificationConfig;
