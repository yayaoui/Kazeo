import { Address } from "./address";
import { ResponsibleOfSubcontractor } from "./responsible-of-subcontractor";

export interface Subcontractor {
  id: number;
  company: string;
  workSector: string;
  description: string;
  email: string;
  phone: string;
  address: Address;
  status: 'active' | 'inactive';
  rating: number;
  skills: string[];
  archived?: boolean;
  profilePicture?: string;
  responsibleOfSubcontractors: ResponsibleOfSubcontractor;
  regestrationCompleted?: boolean;
}
