export interface RolePermissions {
  id: string;
  actions: ("read" | "write" | "update" | "delete")[];
}

export interface Role {
  id: string;
  name: string;
  permissions: RolePermissions[] | undefined;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePlan {
  id: string;
  name: string;
}
