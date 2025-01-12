export interface Client {
    id?: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
