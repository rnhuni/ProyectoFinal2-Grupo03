export interface RolePermissions {
  id: string;
  actions: ("read" | "write" | "update" | "delete")[];
}

export interface Role {
  id: string;
  name: string;
  permissions: RolePermissions[] | undefined;
  created_at?: string;
  updated_at?: string;
}

export interface RolePlan {
  id: string;
  name: string;
}
