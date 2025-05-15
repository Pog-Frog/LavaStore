import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { BackendOrder, BackendOrderItem } from '../models/order.interface';
import { HomeComponent } from '../layouts/home/home.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: (BackendOrder & { showItems?: boolean })[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data.map(order => ({ ...order, showItems: false }))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.showError('Failed to load your orders. Please try again later.');
        this.loading = false;
        console.error('Error fetching orders:', err);
      }
    });
  }

  getOrderTotal(order: BackendOrder): number {
    return parseFloat(order.total);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'shipped':
        return 'bg-sky-100 text-sky-700 border-sky-400';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  }

  toggleOrderItems(order: BackendOrder & { showItems?: boolean }) {
    order.showItems = !order.showItems;
  }

  getProductImage(item: BackendOrderItem): string {
    return item.product?.image_url || 'assets/images/placeholder-image.png';
  }

  getItemSubtotal(item: BackendOrderItem): number {
    return parseFloat(item.price) * item.quantity;
  }
}
