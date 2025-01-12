import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  clientForm: FormGroup;
  client: Client | null = null;
  loading = false;
  error = '';
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
      address: ['', Validators.required],
      status: ['active'],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id !== 'new') {
      this.loadClient(+id);
    } else {
      this.isEditing = true;
    }
  }

  loadClient(id: number): void {
    this.loading = true;
    this.clientService.getClient(id).subscribe({
      next: (data) => {
        this.client = data;
        this.clientForm.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading client';
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.client) {
      this.clientForm.patchValue(this.client);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      
      if (this.client?.id) {
        this.clientService.updateClient(this.client.id, clientData).subscribe({
          next: (updatedClient) => {
            this.client = updatedClient;
            this.isEditing = false;
            this.error = '';
          },
          error: (error) => {
            this.error = 'Error updating client';
          }
        });
      } else {
        this.clientService.createClient(clientData).subscribe({
          next: (newClient) => {
            this.router.navigate(['/company/clients', newClient.id]);
          },
          error: (error) => {
            this.error = 'Error creating client';
          }
        });
      }
    }
  }

  cancel(): void {
    if (this.client) {
      this.toggleEdit();
    } else {
      this.router.navigate(['/company/clients']);
    }
  }
}
