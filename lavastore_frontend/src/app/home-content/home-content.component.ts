import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.interface';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-content',
  imports: [CommonModule],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadHomePageProducts();
  }

  loadHomePageProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getHomePageProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load featured products. Please try again later.';
        this.loading = false;
        console.error('Error loading featured products:', error);
      }
    });
  }
}
