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
  private adminOrdersUrl = `${environment.apiUrl}/orders`;
  private userSpecificOrdersUrl = `${environment.apiUrl}/orders/user`;
  constructor(private http: HttpClient) {}

  createOrder(orderPayload: CreateOrderPayload): Observable<BackendOrder> {
    return this.http.post<BackendResponse<BackendOrder>>(this.adminOrdersUrl, orderPayload)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error creating order:', error);
          return throwError(() => error);
        })
      );
  }

  getAllOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(this.adminOrdersUrl)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return throwError(() => error);
        })
      );
  }

  getOrderById(orderId: number | string): Observable<BackendOrder> {
    return this.http.get<BackendResponse<BackendOrder>>(`${this.adminOrdersUrl}/${orderId}`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching order:', error);
          return throwError(() => error);
        })
      );
  }

  getMyOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(this.userSpecificOrdersUrl)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return throwError(() => error);
        })
      );
  }

  updateOrderItems(orderId: number | string, itemsPayload: OrderItemPayload[]): Observable<BackendOrder> {
    return this.http.put<BackendResponse<BackendOrder>>(`${this.adminOrdersUrl}/${orderId}`, itemsPayload)
      .pipe(map(response => response.data));
  }

  updateOrderStatus(orderId: number | string, status: string): Observable<BackendOrder> {
    return this.http.patch<BackendResponse<BackendOrder>>(`${this.adminOrdersUrl}/${orderId}/status`, { status })
      .pipe(map(response => response.data));
  }

  deleteOrder(orderId: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.adminOrdersUrl}/${orderId}`);
  }
}