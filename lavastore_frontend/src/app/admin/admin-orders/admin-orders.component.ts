import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { BackendOrder } from '../../models/order.interface';
import { NotificationService } from '../../services/notification.service';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminLayoutComponent],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: BackendOrder[] = [];
  filteredOrders: BackendOrder[] = [];
  loading = true;
  error: string | null = null;
  statusFilter: string = 'all';
  searchQuery: string = '';
  
  expandedOrderId: number | null = null;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Error fetching orders:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === this.statusFilter.toLowerCase());
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.id.toString().includes(query) || 
        order.user?.name?.toLowerCase().includes(query) ||
        order.total.toString().includes(query)
      );
    }
    
    this.filteredOrders = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id.toString() === orderId);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...updatedOrder };
          this.applyFilters();
        }
        this.notificationService.showSuccess(`Order status updated to ${status}`);
      },
      error: (err) => {
        this.notificationService.showError('Failed to update order status');
        console.error('Error updating order status:', err);
      }
    });
  }

  getProductNames(order: BackendOrder): string {
    if (!order.order_items || order.order_items.length === 0) {
      return 'No products';
    }
    
    return order.order_items
      .map(item => item.product?.name || `Product #${item.product_id}`)
      .join(', ');
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
