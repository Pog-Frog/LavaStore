import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "../layouts/home/home.component";
import { ProductService } from '../services/product.service';
import { Product, ProductFilters } from '../models/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-home',
  imports: [CommonModule, HomeComponent, FormsModule],
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.css'
})
export class ProductsHomeComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  filters: ProductFilters = {
    category: undefined,
    min_price: 0,
    max_price: 100,
    dietary_preferences: [],
    sort_by: 'popularity',
    page: 1,
    per_page: 6
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.data.data;
        this.totalPages = response.data.last_page;
        this.currentPage = response.data.current_page;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.category = select.value ? Number(select.value) : undefined;
    this.filters.page = 1;
    this.loadProducts();
  }

  onPriceRangeChange(min: number, max: number): void {
    this.filters.min_price = min;
    this.filters.max_price = max;
    this.filters.page = 1;
    this.loadProducts();
  }

  onDietaryPreferenceChange(preferenceId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters.dietary_preferences = [...(this.filters.dietary_preferences || []), preferenceId];
    } else {
      this.filters.dietary_preferences = this.filters.dietary_preferences?.filter(id => id !== preferenceId);
    }
    this.filters.page = 1;
    this.loadProducts();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.sort_by = select.value;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filters.page = page;
      this.loadProducts();
    }
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadProducts();
  }
}
