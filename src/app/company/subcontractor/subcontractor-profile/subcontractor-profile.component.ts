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
  loading = false;
  error = '';
  activeTab = 'info'; // 'info', 'files', 'contracts'
  
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Add methods for handling files and contracts here
  uploadFile(): void {
    // Implement file upload logic
  }

  addContract(): void {
    // Implement contract addition logic
  }
}
