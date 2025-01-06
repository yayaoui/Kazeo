import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subcontractor } from '../models/subcontractor.model';

interface PageResponse {
  content: Subcontractor[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubcontractorService {
  private apiUrl = 'http://localhost:3000/subcontractors';

  constructor(private http: HttpClient) { }

  getSubcontractors(page: number, size: number): Observable<PageResponse> {
    const start = page * size;
    const end = start + size;
    
    return this.http.get<Subcontractor[]>(this.apiUrl).pipe(
      map(subcontractors => {
        const filteredSubcontractors = subcontractors.filter(s => !s.archived);
        const totalElements = filteredSubcontractors.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filteredSubcontractors.slice(start, end);
        
        return {
          content,
          totalPages,
          totalElements,
          size,
          number: page
        };
      })
    );
  }

  getSubcontractorById(id: number): Observable<Subcontractor> {
    return this.http.get<Subcontractor>(`${this.apiUrl}/${id}`);
  }

  createSubcontractor(subcontractor: Omit<Subcontractor, 'id'>): Observable<Subcontractor> {
    return this.http.post<Subcontractor>(this.apiUrl, subcontractor);
  }

  updateSubcontractor(id: number, subcontractor: Partial<Subcontractor>): Observable<Subcontractor> {
    return this.http.patch<Subcontractor>(`${this.apiUrl}/${id}`, subcontractor);
  }

  deleteSubcontractor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  archiveSubcontractor(id: number): Observable<Subcontractor> {
    return this.http.patch<Subcontractor>(`${this.apiUrl}/${id}`, { archived: true });
  }
}
