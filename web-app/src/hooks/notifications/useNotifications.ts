// useNotifications.ts
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Notification,
  UseNotificationsResult,
} from "../../interfaces/Notifications";

const useNotifications = (): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Notification[]>(
          "https://api.abcallg03.com/v2/system/notifications"
        );
        setNotifications(response.data);
      } catch {
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading, error };
};

export default useNotifications;
