export interface User {
  id?: string;
  name: string;
  email: string;
  role_id: string;
  client_id: string;
}

export interface UserTableData {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}
