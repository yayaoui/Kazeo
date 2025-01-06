export interface Subcontractor {
  id: number;
  responsible: string;
  company: string;
  expertise: string;
  email: string;
  phone: string;
  status: string;
  rating: number;
  location: string;
  Description: string;
  skills: string[];
  archived?: boolean;
}
