import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ message: string; data: Category[] }> {
    return this.http.get<{ message: string; data: Category[] }>(this.apiUrl);
  }

  getCategory(id: number): Observable<{ message: string; data: Category }> {
    return this.http.get<{ message: string; data: Category }>(`${this.apiUrl}/${id}`);
  }
}
