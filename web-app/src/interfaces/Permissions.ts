export interface Permission {
  id: string;
  name: string;
  resource: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  actions?: ("write" | "read" | "update" | "delete")[];
}
