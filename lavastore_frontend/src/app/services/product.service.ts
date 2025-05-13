import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PaginatedResponse, ProductFilters } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', (filters.page || 1).toString())
      .set('per_page', (filters.per_page || 15).toString())
      .set('include', 'category,dietaryPreferences');

    if (filters.category) params = params.set('filter[category_id]', filters.category.toString());
    if (filters.min_price !== undefined && filters.max_price !== undefined) {
        params = params.set('filter[price_between]', `${filters.min_price},${filters.max_price}`);
    }
    if (filters.sort_by) {
      const sortMap: { [key: string]: string } = {
        'popularity': '-created_at',
        'price_asc': 'price',
        'price_desc': '-price',
        'newest': '-created_at',
        'name_asc': 'name',
        'name_desc': '-name'
      };
      params = params.set('sort', sortMap[filters.sort_by] || '-created_at');
    }
    if (filters.dietary_preferences?.length) {
      filters.dietary_preferences.forEach(pref => {
        params = params.append('filter[dietary_preferences][]', pref.toString());
      });
    }

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<{ message: string; data: Product }> {
    const params = new HttpParams() 
      .set('include', 'category,dietaryPreferences');

    return this.http.get<{ message: string; data: Product }>(`${this.apiUrl}/${id}`, { params });
  }

  getFeaturedProducts(): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('is_featured', 'true')
      .set('per_page', '4')
      .set('include', 'category,dietaryPreferences');

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getProductsByCategory(categoryId: number, page: number = 1): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('category_id', categoryId.toString())
      .set('page', page.toString())
      .set('include', 'category,dietaryPreferences');

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getHomePageProducts(): Observable<{ message: string; data: Product[] }> {
    return this.http.get<{ message: string; data: Product[] }>(`${this.apiUrl}/featured`);
  }
} 