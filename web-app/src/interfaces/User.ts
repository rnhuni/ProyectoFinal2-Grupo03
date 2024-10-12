export interface User {
    id: number;
    name: string; 
    email: string; 
    role: string;  
    status: 'Active' | 'Completed' | 'Inactive'; 
    createdAt?: string;
    updatedAt?: string;
  }
  