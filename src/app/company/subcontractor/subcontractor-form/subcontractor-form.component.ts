import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { NotificationService } from '../../../services/notification.service';
import * as bootstrap from 'bootstrap';
import { Subcontractor } from '../../../models/subcontractor.model';


@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.scss']
})
export class SubcontractorFormComponent implements OnInit {
  subcontractorForm: FormGroup;
  isSubmitting = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Input() subcontractor: Subcontractor | null = null;
  error = '';

  constructor(
    private fb: FormBuilder,
    private subcontractorService: SubcontractorService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.subcontractorForm = this.fb.group({
      responsible: ['', Validators.required],
      company: ['', Validators.required],
      expertise: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['active']
    });
  }

  ngOnInit(): void {
    if (this.subcontractor) {
      this.subcontractorForm.patchValue(this.subcontractor);
    }
  }

  onSubmit(): void {
    if (this.subcontractorForm.invalid) {
      this.notificationService.showWarning('Veuillez remplir tous les champs obligatoires');
      Object.keys(this.subcontractorForm.controls).forEach(key => {
        const control = this.subcontractorForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.subcontractorForm.value;

    const request = this.subcontractor
      ? this.subcontractorService.updateSubcontractor(this.subcontractor.id, formData)
      : this.subcontractorService.createSubcontractor(formData);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        const message = this.subcontractor
          ? 'Sous-traitant mis à jour avec succès'
          : 'Nouveau sous-traitant créé avec succès';
        this.notificationService.showSuccess(message);
        
        // Close modal using Bootstrap 5 method
        const modalElement = document.getElementById('createSubcontractorModal');
        if (modalElement) {
          const bsModal = new bootstrap.Modal(modalElement);
          bsModal.hide();
        }
        
        this.saved.emit();
        this.loadSubcontractors();
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = this.subcontractor
          ? 'Erreur lors de la mise à jour du sous-traitant'
          : 'Erreur lors de la création du sous-traitant';
        this.notificationService.showError(errorMessage);
        console.error('Error:', error);
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/sous-traitant']);
  }

  onClear(): void {
    this.subcontractorForm.reset({ status: 'active' });
    this.notificationService.showInfo('Formulaire réinitialisé');
  }

  private loadSubcontractors(): void {
    // Reload the list after successful operation
    this.subcontractorService.getSubcontractors(0, 10).subscribe({
      next: () => {
        this.router.navigate(['/sous-traitant']);
      },
      error: (error) => {
        console.error('Error loading subcontractors:', error);
        this.notificationService.showError('Erreur lors du chargement des sous-traitants');
      }
    });
  }
}
