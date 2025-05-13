// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { /* ... your interfaces ... */ CreateOrderPayload, BackendOrder, BackendResponse, OrderItemPayload } from '../models/order.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private adminOrdersUrl = `${environment.apiUrl}/orders`;
  private userSpecificOrdersUrl = `${environment.apiUrl}/orders/user`;
  constructor(private http: HttpClient) {}

  createOrder(orderPayload: CreateOrderPayload): Observable<BackendOrder> {
    return this.http.post<BackendResponse<BackendOrder>>(this.adminOrdersUrl, orderPayload)
      .pipe(map(response => response.data));
  }

  getAllOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(this.adminOrdersUrl)
      .pipe(map(response => response.data));
  }

  getOrderById(orderId: number | string): Observable<BackendOrder> {
    return this.http.get<BackendResponse<BackendOrder>>(`${this.adminOrdersUrl}/${orderId}`)
      .pipe(map(response => response.data));
  }

  getMyOrders(): Observable<BackendOrder[]> {
    return this.http.get<BackendResponse<BackendOrder[]>>(this.userSpecificOrdersUrl)
      .pipe(map(response => response.data));
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