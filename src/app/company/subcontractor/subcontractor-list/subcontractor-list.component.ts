import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { Subcontractor } from '../../../models/subcontractor.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-subcontractor-list',
  templateUrl: './subcontractor-list.component.html',
  styleUrls: ['./subcontractor-list.component.scss']
})
export class SubcontractorListComponent implements OnInit, OnDestroy {
  subcontractors: Subcontractor[] = [];
  selectedContractor: Subcontractor | null = null;
  loading = false;
  error = '';
  page = 0;
  size = 10;
  pages: number[] = [];
  totalPages = 0;
  searchFormGroup!: FormGroup;

  private statusChangeModal: any;
  private archiveModal: any;
  private createSubcontractorModal: any;
  // initialize new subcontractor
  newSubcontractor: Omit<Subcontractor, 'id' | 'responsibleOfSubcontractors'> = {
    company: '',
    workSector: '',
    address: {
      street: '',
      city: '',
      zip: ''
    },
    phone: '',
    email: '',
    description: '',
    status: 'active',
    rating: 0,
    skills: [],
    archived: false,
    profilePicture: '',
    regestrationCompleted: false
  };

  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private subcontractorService: SubcontractorService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });

    // Setup search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(keyword => {
      this.handleSearch(keyword);
    });
  }

  ngOnInit(): void {
    this.loadSubcontractors();
    this.initializeModals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialize modals
  private initializeModals(): void {
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

  // Load subcontractors
  loadSubcontractors(): void {
    this.loading = true;
    this.subcontractorService.getSubcontractors(this.page, this.size).subscribe({
      next: (response) => {
        this.subcontractors = response.content;
        this.totalPages = response.totalPages;
        this.pages = Array(this.totalPages).fill(0).map((_, i) => i);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Une erreur est survenue lors du chargement des sous-traitants.';
        this.loading = false;
        console.error('Error loading subcontractors:', error);
      }
    });
  }

  onSearch(): void {
    const keyword = this.searchFormGroup.get('keyword')?.value;
    this.searchSubject.next(keyword);
  }

  handleSearch(keyword: string): void {
    this.loading = true;
    this.subcontractorService.searchSubcontractors(keyword, this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.subcontractors = data.content;
          this.totalPages = data.totalPages;
          this.pages = new Array(this.totalPages).fill(0).map((_, index) => index);
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
          this.loading = false;
          this.toastr.error('Une erreur est survenue lors de la recherche');
        }
      });
  }

  handleSearchCustomers(): void {
    const keyword = this.searchFormGroup.get('keyword')?.value;
    this.handleSearch(keyword);
  }

  // Navigation methods
  gotToPage(page: number): void {
    this.page = page;
    this.loadSubcontractors();
  }

  goToFirstPage(): void {
    this.gotToPage(0);
  }

  goToPreviousPage(): void {
    if (this.page > 0) {
      this.gotToPage(this.page - 1);
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage) {
      this.gotToPage(this.page + 1);
    }
  }

  goToLastPage(): void {
    this.gotToPage(this.totalPages - 1);
  }

  get isLastPage(): boolean {
    return this.page === this.totalPages - 1;
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
    
    this.subcontractorService.updateSubcontractor(this.selectedContractor.id, { status: newStatus }).subscribe({
      next: () => {
        this.selectedContractor!.status = newStatus;
        this.loading = false;
        this.statusChangeModal?.hide();
        this.loadSubcontractors();
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
    this.subcontractorService.archiveSubcontractor(this.selectedContractor.id).subscribe({
      next: () => {
        this.loading = false;
        this.archiveModal?.hide();
        this.loadSubcontractors();
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Erreur lors de l\'archivage du sous-traitant';
        this.loading = false;
        console.error('Error archiving subcontractor:', error);
      }
    });
  }

  createSubcontractor(): void {
    this.newSubcontractor 
    this.createSubcontractorModal.show();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newSubcontractor.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveSubcontractor(): void {
    if (this.selectedFile && this.selectedFile.size > 5000000) { // 5MB limit
      this.toastr.error('La taille du fichier ne doit pas dépasser 5MB', 'Erreur');
      return;
    }

    this.loading = true;
    this.subcontractorService.createSubcontractor(this.newSubcontractor).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success('Sous-traitant créé avec succès', 'Succès');
        this.loadSubcontractors();
        this.createSubcontractorModal.hide();
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Erreur lors de la création du sous-traitant', 'Erreur');
        console.error('Error creating subcontractor:', error);
      }
    });
  }

  resetForm(): void {
    this.newSubcontractor = {
      company: '',
      workSector: '',
      address: {
        street: '',
        city: '',
        zip: ''
      },
      phone: '',
      email: '',
      description: '',
      status: 'active',
      rating: 0,
      skills: [],
      archived: false,
      profilePicture: ''
    };
    this.selectedFile = null;
  }
}
