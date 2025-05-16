import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { BackendOrder } from '../../models/order.interface';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLayoutComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  recentOrders: BackendOrder[] = [];
  topSellingProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  loading = {
    orders: true,
    products: true
  };
  metrics = {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadRecentOrders();
    this.loadProductData();
  }

  loadRecentOrders(): void {
    this.loading.orders = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5);
        this.calculateMetrics(orders);
        this.loading.orders = false;
      },
      error: (err) => {
        console.error('Error loading recent orders', err);
        this.loading.orders = false;
      }
    });
  }

  loadProductData(): void {
    this.loading.products = true;
    this.productService.getProducts({ page: 1, per_page: 100 }).subscribe({
      next: (response) => {
        const products = response.data.data;
        
        this.topSellingProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        this.lowStockProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        this.loading.products = false;
      },
      error: (err) => {
        console.error('Error loading product data', err);
        this.loading.products = false;
      }
    });
  }

  calculateMetrics(orders: BackendOrder[]): void {
    this.metrics.totalOrders = orders.length;
    this.metrics.pendingOrders = orders.filter(order => 
      order.status.toLowerCase() === 'pending'
    ).length;
    
    this.metrics.revenue = orders.reduce((total, order) => {
      return total + parseFloat(order.total.toString());
    }, 0);
    
    this.metrics.totalSales = orders.reduce((total, order) => {
      const itemCount = order.order_items?.reduce((count, item) => count + item.quantity, 0) || 0;
      return total + itemCount;
    }, 0);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }
}
