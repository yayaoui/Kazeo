import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubcontractorService } from '../../../services/subcontractor.service';
import { Subcontractor } from '../../../models/subcontractor.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subcontractor-profile',
  templateUrl: './subcontractor-profile.component.html',
  styleUrls: ['./subcontractor-profile.component.css']
})

export class SubcontractorProfileComponent implements OnInit {
  subcontractor: Subcontractor | null = null;
  editedSubcontractor: Subcontractor | null = null;
  isEditing = false;
  loading = false;
  error = '';
  activeTab = 'info'; // 'info', 'files', 'contracts'
  newSkill = '';

  constructor(
    private route: ActivatedRoute,
    private subcontractorService: SubcontractorService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadSubcontractor(params['id']);
      }
    });
  }

  loadSubcontractor(id: number): void {
    this.loading = true;
    this.subcontractorService.getSubcontractorById(id).subscribe({
      next: (data) => {
        this.subcontractor = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement du sous-traitant';
        this.loading = false;
        console.error('Error loading subcontractor:', error);
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.editedSubcontractor = this.subcontractor ? {
        ...this.subcontractor
      } : {
        id: 0,
        company: '',
        workSector: '',
        description: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          zip: ''
        },
        status: 'inactive',
        rating: 0,
        skills: [],
        profilePicture: '',
        manager: {
          id: 0,
          firstName: '',
          lastName: '',
          email: '',
          phone1: '',
          phone2: '',
          role: ''
        }
      };
    }
    this.isEditing = !this.isEditing;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editedSubcontractor) {
          this.editedSubcontractor.profilePicture = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addSkill(): void {
    if (this.newSkill.trim() && this.editedSubcontractor) {
      if (!this.editedSubcontractor.skills) {
        this.editedSubcontractor.skills = [];
      }
      if (!this.editedSubcontractor.skills.includes(this.newSkill.trim())) {
        this.editedSubcontractor.skills.push(this.newSkill.trim());
      }
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    if (this.editedSubcontractor && this.editedSubcontractor.skills) {
      this.editedSubcontractor.skills = this.editedSubcontractor.skills.filter(s => s !== skill);
    }
  }

  saveChanges(): void {
    if (!this.editedSubcontractor || !this.subcontractor?.id) return;

    this.loading = true;
    this.subcontractorService.updateSubcontractor(this.subcontractor.id, this.editedSubcontractor).subscribe({
      next: (updatedSubcontractor) => {
        this.subcontractor = updatedSubcontractor;
        this.isEditing = false;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Erreur lors de la mise à jour du sous-traitant';
        this.loading = false;
        console.error('Error updating subcontractor:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  uploadFile(): void {
    // Implement file upload logic
  }

  addContract(): void {
    // Implement contract addition logic
  }
}
