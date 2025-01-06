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
  loading = false;
  error = '';
  page = 0;
  size = 7;
  pages: any = [];
  totalPages = 0;

  constructor(
    private subcontractorService: SubcontractorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSubcontractors();
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      this.detailsModal = new bootstrap.Modal(modalElement);
    }
  }

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

  gotToPage(page: number) {
    this.page = page;
    this.loadSubcontractors();
  }

  goToFirstPage() {
    this.page = 0;
    this.loadSubcontractors();
  }

  goToPreviousPage() {
    this.page--;
    this.loadSubcontractors();
  }

  goToNextPage() {
    this.page++;
    this.loadSubcontractors();
  }

  goToLastPage() {
    this.page = this.totalPages - 1;
    this.loadSubcontractors();
  }

  get isLastPage() {
    return this.page === this.totalPages - 1;
  }

  navigateToCreate(): void {
    this.router.navigate(['/sous-traitant/create']);
  }

  showDetails(contractor: Subcontractor): void {
    this.selectedContractor = contractor;
    if (this.detailsModal) {
      this.detailsModal.show();
    }
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

  openDetailsModal(contractor: Subcontractor): void {
    this.selectedContractor = contractor;
    this.detailsModal?.show();
  }

  closeDetailsModal(): void {
    this.detailsModal?.hide();
    this.selectedContractor = null;
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
}
