import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.scss']
})
export class SubcontractorFormComponent {
  subcontractorForm: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private subcontractorService: SubcontractorService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.subcontractorForm = this.fb.group({
      companyName: this.fb.control('', Validators.required),
      phone: this.fb.control('', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      expertise: this.fb.control('', Validators.required),
      city: this.fb.control('', Validators.required),
      street: this.fb.control('', Validators.required),
      postalCode: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      profilePicture: this.fb.control(''),
      status: this.fb.control('active')
    });
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

    this.subcontractorService.createSubcontractor(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.showSuccess('Nouveau sous-traitant créé avec succès');
        this.router.navigate(['/sous-traitant']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError('Erreur lors de la création du sous-traitant');
        console.error('Error:', error);
      }
    });
  }

  onClear(): void {
    this.subcontractorForm.reset({ status: 'active' });
    this.notificationService.showInfo('Formulaire réinitialisé');
  }
}
