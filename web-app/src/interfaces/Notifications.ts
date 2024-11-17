export interface Notification {
  id: string;
  name: string;
  service: string;
  show_by_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}
