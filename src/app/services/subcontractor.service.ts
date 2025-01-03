import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcontractor } from '../models/subcontractor.model';

@Injectable({
  providedIn: 'root'
})
export class SubcontractorService {
  private apiUrl = 'http://localhost:3000/subcontractors';

  constructor(private http: HttpClient) { }

  // Get all subcontractors
  getAllSubcontractors(): Observable<Subcontractor[]> {
    return this.http.get<Subcontractor[]>(this.apiUrl);
  }

  // Get a single subcontractor by ID
  getSubcontractorById(id: number): Observable<Subcontractor> {
    return this.http.get<Subcontractor>(`${this.apiUrl}/${id}`);
  }

  // Create a new subcontractor
  createSubcontractor(subcontractor: Omit<Subcontractor, 'id'>): Observable<Subcontractor> {
    return this.http.post<Subcontractor>(this.apiUrl, subcontractor);
  }

  // Update a subcontractor
  updateSubcontractor(id: number, subcontractor: Partial<Subcontractor>): Observable<Subcontractor> {
    return this.http.patch<Subcontractor>(`${this.apiUrl}/${id}`, subcontractor);
  }

  // Delete a subcontractor
  deleteSubcontractor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
