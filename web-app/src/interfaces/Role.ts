import { Permission } from './Permissions';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}
