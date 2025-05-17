import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, PaginatedResponse, ProductFilters } from '../models/product.interface';
import { environment } from '../../environments/environment';
import { BackendResponse } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private baseUrl = environment.apiUrl;

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

  createProduct(productData: any): Observable<Product> {
    return this.http.post<BackendResponse<Product>>(this.apiUrl, productData)
      .pipe(map(response => response.data));
  }

  updateProduct(id: string, productData: any): Observable<Product> {
    return this.http.post<BackendResponse<Product>>(`${this.apiUrl}/${id}`, productData)
      .pipe(map(response => response.data));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchProducts(options: {
    q?: string;
    category_id?: number;
    featured?: boolean;
    page?: number;
    per_page?: number;
    with?: string[];
  }): Observable<any> {
    let params = new HttpParams();
    
    if (options.q) {
      params = params.set('q', options.q);
    }
    
    if (options.category_id && options.category_id > 0) {
      params = params.set('category_id', options.category_id.toString());
    }
    
    if (options.featured !== undefined) {
      params = params.set('featured', options.featured.toString());
    }
    
    if (options.page) {
      params = params.set('page', options.page.toString());
    }
    
    if (options.per_page) {
      params = params.set('per_page', options.per_page.toString());
    }
    
    if (options.with && options.with.length > 0) {
      params = params.set('with', options.with.join(','));
    }
    
    return this.http.get<any>(`${this.baseUrl}/products/search`, { params });
  }
}