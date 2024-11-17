export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  client_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  features: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role_id: string;
  client_id: string;
}

export interface UseCreateUserResult {
  createUser: (user: CreateUserRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role_id: string;
  client_id: string;
}

export interface UseUpdateUserResult {
  updateUser: (id: string, user: UpdateUserRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
}
