export interface CreateSession {
  channel_id: string;
  created_at: string; // ISO string format
  id: string; // UUID
  opened_by_id: string; // UUID
  opened_by_name: string;
  opened_by_type: string;
  status: string;
  topic: string;
  topic_refid: string;
  updated_at: string; // ISO string format
}
