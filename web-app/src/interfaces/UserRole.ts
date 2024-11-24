export interface UserRole {
    id: number;
    userId: number;
    role: string;
    status: 'Active' | 'Completed' | 'Inactive';
    created_at?: string;
    email?: string;
}