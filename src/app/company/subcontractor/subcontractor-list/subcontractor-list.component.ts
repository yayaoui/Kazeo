import { Component, OnInit } from '@angular/core';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { Subcontractor } from '../../../models/subcontractor.model';
declare var bootstrap: any;

@Component({
  selector: 'app-subcontractor-list',
  templateUrl: './subcontractor-list.component.html',
  styleUrls: ['./subcontractor-list.component.scss']
})
export class SubcontractorListComponent implements OnInit {
  subcontractors: Subcontractor[] = [];
  selectedContractor: Subcontractor | null = null;
  private modal: any;
  loading = false;
  error = '';

  constructor(private subcontractorService: SubcontractorService) {}

  ngOnInit(): void {
    this.loadSubcontractors();
    // Initialize Bootstrap modal
    const modalElement = document.getElementById('subcontractorModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  // Load all subcontractors
  loadSubcontractors(): void {
    this.loading = true;
    this.subcontractorService.getAllSubcontractors()
      .subscribe({
        next: (data) => {
          this.subcontractors = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading subcontractors';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  // Open modal with subcontractor details
  openModal(contractor: Subcontractor): void {
    this.selectedContractor = contractor;
    this.modal?.show();
  }

  // Close modal
  closeModal(): void {
    this.selectedContractor = null;
    this.modal?.hide();
  }

  // Show modal to add new subcontractor
  showAddModal(): void {
    this.selectedContractor = null; // Reset selected contractor
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Add new subcontractor
  addSubcontractor(subcontractor: Omit<Subcontractor, 'id'>): void {
    this.subcontractorService.createSubcontractor(subcontractor)
      .subscribe({
        next: (newSubcontractor) => {
          this.subcontractors.push(newSubcontractor);
          this.closeModal();
        },
        error: (error) => {
          this.error = 'Error adding subcontractor';
          console.error('Error:', error);
        }
      });
  }

  // Update subcontractor
  updateSubcontractor(id: number, updates: Partial<Subcontractor>): void {
    this.subcontractorService.updateSubcontractor(id, updates)
      .subscribe({
        next: (updatedSubcontractor) => {
          const index = this.subcontractors.findIndex(s => s.id === id);
          if (index !== -1) {
            this.subcontractors[index] = updatedSubcontractor;
          }
          this.closeModal();
        },
        error: (error) => {
          this.error = 'Error updating subcontractor';
          console.error('Error:', error);
        }
      });
  }

  // Delete subcontractor
  deleteSubcontractor(id: number): void {
    if (confirm('Are you sure you want to delete this subcontractor?')) {
      this.subcontractorService.deleteSubcontractor(id)
        .subscribe({
          next: () => {
            this.subcontractors = this.subcontractors.filter(s => s.id !== id);
          },
          error: (error) => {
            this.error = 'Error deleting subcontractor';
            console.error('Error:', error);
          }
        });
    }
  }
}
