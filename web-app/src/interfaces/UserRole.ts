export interface UserRole {
    id: number;
    userId: number;
    role: string;
    status: 'Active' | 'Completed' | 'Inactive'; // Agregar 'Completed'
    createdAt?: string;
    email?: string;
}