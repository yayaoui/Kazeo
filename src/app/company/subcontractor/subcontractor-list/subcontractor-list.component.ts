import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { Subcontractor } from '../../../models/subcontractor.model';
import { HttpErrorResponse } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-subcontractor-list',
  templateUrl: './subcontractor-list.component.html',
  styleUrls: ['./subcontractor-list.component.scss']
})
export class SubcontractorListComponent implements OnInit {
  subcontractors: Subcontractor[] = [];
  selectedContractor: Subcontractor | null = null;
  private detailsModal: any;
  private statusChangeModal: any;
  private archiveModal: any;
  private createSubcontractorModal: any;
  loading = false;
  error = '';
  page = 0;
  size = 10;
  pages: any = [];
  totalPages = 0;

  constructor(
    private subcontractorService: SubcontractorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSubcontractors();
    // Initialize Bootstrap modals
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      this.detailsModal = new bootstrap.Modal(modalElement);
    }
    const statusChangeModalElement = document.getElementById('statusChangeModal');
    if (statusChangeModalElement) {
      this.statusChangeModal = new bootstrap.Modal(statusChangeModalElement);
    }
    const archiveModalElement = document.getElementById('archiveModal');
    if (archiveModalElement) {
      this.archiveModal = new bootstrap.Modal(archiveModalElement);
    }
    const createSubcontractorModalElement = document.getElementById('createSubcontractorModal');
    if (createSubcontractorModalElement) {
      this.createSubcontractorModal = new bootstrap.Modal(createSubcontractorModalElement);
    }
  }

  // Method to load subcontractors
  loadSubcontractors(): void {
    this.loading = true;
    this.subcontractorService.getSubcontractors(this.page, this.size)
      .subscribe({
        next: (response) => {
          this.subcontractors = response.content;
          this.totalPages = response.totalPages;
          this.pages = Array(this.totalPages).fill(0).map((x, i) => i);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Une erreur est survenue lors du chargement des sous-traitants.';
          this.loading = false;
        }
      });
  }

  // Method to navigate to a specific page
  gotToPage(page: number) {
    this.page = page;
    this.loadSubcontractors();
  }

  // Method to navigate to the first page
  goToFirstPage() {
    this.page = 0;
    this.loadSubcontractors();
  }

  // Method to navigate to the previous page
  goToPreviousPage() {
    this.page--;
    this.loadSubcontractors();
  }

  // Method to navigate to the next page
  goToNextPage() {
    this.page++;
    this.loadSubcontractors();
  }

  // Method to navigate to the last page
  goToLastPage() {
    this.page = this.totalPages - 1;
    this.loadSubcontractors();
  }

  // Check if it's the last page
  get isLastPage() {
    return this.page === this.totalPages - 1;
  }

  // Method open modal of create subcontractor
  navigateToCreate(): void {
    this.createSubcontractorModal?.show();
  }
   

  deleteSubcontractor(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sous-traitant ?')) {
      this.subcontractorService.deleteSubcontractor(id)
        .subscribe({
          next: () => {
            this.loadSubcontractors();
          },
          error: (error: HttpErrorResponse) => {
            this.error = 'Une erreur est survenue lors de la suppression du sous-traitant.';
          }
        });
    }
  }

  archiveContractor(id: number): void {
    this.subcontractorService.archiveSubcontractor(id)
      .subscribe({
        next: () => {
          this.loadSubcontractors();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error archiving subcontractor:', error);
        }
      });
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/sous-traitant/edit', id]);
  }

  navigateToProfile(id: number): void {
    this.router.navigate(['/sous-traitant/profile', id]);
  }

  confirmStatusChange(contractor: Subcontractor): void {
    this.selectedContractor = contractor;
    this.statusChangeModal?.show();
  }

  toggleStatus(): void {
    if (!this.selectedContractor) return;

    this.loading = true;
    const newStatus = this.selectedContractor.status === 'active' ? 'inactive' : 'active';
    
    this.subcontractorService.updateSubcontractor(this.selectedContractor.id, { status: newStatus })
      .subscribe({
        next: () => {
          this.selectedContractor!.status = newStatus;
          this.loading = false;
          this.statusChangeModal?.hide();
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Erreur lors de la modification du statut';
          this.loading = false;
          console.error('Error updating status:', error);
        }
      });
  }

  confirmArchive(id: number): void {
    const contractor = this.subcontractors.find(c => c.id === id);
    if (contractor) {
      this.selectedContractor = contractor;
      this.archiveModal?.show();
    }
  }

  confirmArchiveAction(): void {
    if (!this.selectedContractor) return;

    this.loading = true;
    this.subcontractorService.archiveSubcontractor(this.selectedContractor.id)
      .subscribe({
        next: () => {
          // Update both archived and status
          this.selectedContractor!.archived = true;
          this.selectedContractor!.status = 'inactive';
          this.loading = false;
          this.archiveModal?.hide();
          this.loadSubcontractors(); // Refresh the list
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Erreur lors de l\'archivage du sous-traitant';
          this.loading = false;
          console.error('Error archiving subcontractor:', error);
        }
      });
  }
}
