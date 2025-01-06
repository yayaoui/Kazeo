export interface Subcontractor {
  id: number;
  company: string;
  expertise: string;
  Description: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  rating: number;
  skills: string[];
  archived?: boolean;
}
