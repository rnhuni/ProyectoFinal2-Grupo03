import { RolePermissions } from './RolePermissions';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: RolePermissions[] | undefined;
  createdAt?: string;
  updatedAt?: string;
}
