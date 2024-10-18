
export interface RolePermissions {
  id: string;
  actions: ("read" | "write" | "update" | "delete" | undefined)[];
}
