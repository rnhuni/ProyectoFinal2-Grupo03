import { Permission } from './Permissions';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[] | undefined;
  createdAt?: string;
  updatedAt?: string;
}
