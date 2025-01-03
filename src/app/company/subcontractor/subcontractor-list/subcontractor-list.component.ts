import { Component, OnInit } from '@angular/core';
declare var bootstrap: any;

interface Subcontractor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  speciality: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-subcontractor-list',
  templateUrl: './subcontractor-list.component.html',
  styleUrls: ['./subcontractor-list.component.scss']
})
export class SubcontractorListComponent implements OnInit {
  subcontractors: Subcontractor[] = [
    {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    }, {
      id: 1,
      name: 'Example Contractor 1',
      email: 'contractor1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      speciality: 'Plumbing',
      status: 'active'
    },
    // Add more sample data as needed
  ];

  selectedContractor: Subcontractor | null = null;
  private modal: any;

  ngOnInit(): void {
    // Initialize the modal
    this.modal = new bootstrap.Modal(document.getElementById('detailsModal'));
  }

  openDetailsModal(contractor: Subcontractor) {
    this.selectedContractor = contractor;
    this.modal.show();
  }

  
  addSubcontractor() {
    // Implement logic to add a new subcontractor
  }
}
