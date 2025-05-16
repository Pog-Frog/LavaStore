import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateOrderPayload, BackendOrder, BackendResponse, OrderItemPayload } from '../models/order.interface';
import { environment } from '../../environments/environment';

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;
  private ordersUrl = `${this.apiUrl}/orders/user`;
  private createOrderUrl = `${this.apiUrl}/orders`;
  private orderStatusUrl = (orderId: string) => `${this.apiUrl}/orders/${orderId}/status`;

  constructor(private http: HttpClient) {}

  createOrder(payload: CreateOrderPayload): Observable<BackendOrder> {
    return this.http.post<BackendResponse<BackendOrder>>(this.createOrderUrl, payload)
      .pipe(map(response => response.data));
  }

  getAllOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(`${this.apiUrl}/orders`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return throwError(() => error);
        })
      );
  }

  getOrderById(orderId: number | string): Observable<BackendOrder> {
    return this.http.get<BackendResponse<BackendOrder>>(`${this.apiUrl}/orders/${orderId}`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching order:', error);
          return throwError(() => error);
        })
      );
  }

  getMyOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(`${this.ordersUrl}`)
      .pipe(map(response => response.data));
  }

  updateOrderItems(orderId: number | string, itemsPayload: OrderItemPayload[]): Observable<BackendOrder> {
    return this.http.put<BackendResponse<BackendOrder>>(`${this.apiUrl}/orders/${orderId}`, itemsPayload)
      .pipe(map(response => response.data));
  }

  updateOrderStatus(orderId: string, status: string): Observable<BackendOrder> {
    return this.http.patch<BackendResponse<BackendOrder>>(
      this.orderStatusUrl(orderId), 
      { status }
    ).pipe(map(response => response.data));
  }

  deleteOrder(orderId: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/orders/${orderId}`);
  }
}