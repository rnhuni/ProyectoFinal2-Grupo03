export interface LoadSession {
  assigned_to_id: string | null;
  assigned_to_name: string | null;
  assigned_to_type: string | null;
  channel_id: string;
  id: string;
  opened_by_id: string;
  opened_by_name: string;
  status: string;
  topic: string;
  topic_refid: string | null;
}
