export interface Permission {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}
