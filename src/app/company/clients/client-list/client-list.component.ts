import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  error = '';
  clientForm!: FormGroup;
  private modal: any;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadClients();
    this.initModal();
  }

  private initForm(): void {
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

  private initModal(): void {
    const modalElement = document.getElementById('addClientModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading clients';
        this.loading = false;
      }
    });
  }

  viewClient(id: number): void {
    this.router.navigate(['/clients', id]);
  }

  createClient(): void {
    this.clientForm.reset({ status: 'active' });
    this.modal?.show();
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = {
        ...this.clientForm.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.clientService.createClient(clientData).subscribe({
        next: (newClient) => {
          this.modal?.hide();
          this.loadClients();
          this.clientForm.reset({ status: 'active' });
        },
        error: (error) => {
          this.error = 'Error creating client';
        }
      });
    } else {
      Object.keys(this.clientForm.controls).forEach(key => {
        const control = this.clientForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
