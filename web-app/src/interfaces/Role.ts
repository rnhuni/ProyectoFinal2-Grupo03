import { RolePermissions } from './RolePermissions';

export interface Role {
  id: string;
  name: string;
  permissions: RolePermissions[] | undefined;
  createdAt?: string;
  updatedAt?: string;
}
