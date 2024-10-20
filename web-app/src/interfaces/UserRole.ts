export interface UserRole {
    id: number;
    userId: number;
    role: string;
    status: 'Active' | 'Completed' | 'Inactive';
    createdAt?: string;
    email?: string;
}