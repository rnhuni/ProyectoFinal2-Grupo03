export interface Role {
    id: number;
    roleName: string;          // Name of the role, like "Admin", "User", etc.
    status: 'Active' | 'Inactive';  // Whether the role is currently active or not
    permissions: number[];      // Array of permission IDs associated with this role
    description?: string;       // Optional description of the role's responsibilities or scope
    createdAt?: string;         // Timestamp when the role was created
  }
  