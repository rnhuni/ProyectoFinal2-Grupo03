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
  createdAt: string;
  updatedAt: string;
}
