export interface Permission {
  id: string;
  name: string;
  resource: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  actions?: ("write" | "read" | "update" | "delete")[];
}
