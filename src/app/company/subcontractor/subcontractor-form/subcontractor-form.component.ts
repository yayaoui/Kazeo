import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subcontractor } from '../../../models/subcontractor.model';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.scss']
})
export class SubcontractorFormComponent implements OnInit {
  @Input() subcontractor: Subcontractor | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  subcontractorForm: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private subcontractorService: SubcontractorService,
    private router: Router
  ) {
    this.subcontractorForm = this.fb.group({
      responsible: ['', Validators.required],
      company: ['', Validators.required],
      expertise: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.subcontractor) {
      this.subcontractorForm.patchValue(this.subcontractor);
    }
  }

  onSubmit(): void {
    if (this.subcontractorForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const subcontractorData = this.subcontractorForm.value;

    const request = this.subcontractor
      ? this.subcontractorService.updateSubcontractor(this.subcontractor.id, subcontractorData)
      : this.subcontractorService.createSubcontractor(subcontractorData);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
        this.router.navigate(['/sous-traitant']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = 'Error saving subcontractor. Please try again.';
        console.error('Error:', error);
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/sous-traitant']);
  }

  onClear(): void {
    this.subcontractorForm.reset();
  }
}
