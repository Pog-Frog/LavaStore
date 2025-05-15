import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "../layouts/home/home.component";
import { ProductService } from '../services/product.service';
import { Category, Product, ProductFilters } from '../models/product.interface';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { CartService } from '../services/cart.service';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-products-home',
  standalone: true,
  imports: [CommonModule, HomeComponent, FormsModule, RouterModule],
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.css'
})
export class ProductsHomeComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  categories: Category[] = [];
  showMobileFilters = false;

  filters: ProductFilters = {
    category: 0,
    min_price: 0,
    max_price: 100,
    dietary_preferences: [],
    sort_by: 'popularity',
    page: 1,
    per_page: 6
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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

        if (window.innerWidth < 768) {
          this.showMobileFilters = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load products. Please try again later.';
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        this.error = 'Failed to load categories. Please try again later.';
        console.error('Error loading categories:', error);
      }
    });
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.category = parseInt(select.value);
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

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  toggleFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  resetFilters(): void {
    this.filters = {
      category: 0,
      min_price: 0,
      max_price: 100,
      dietary_preferences: [],
      sort_by: 'popularity',
      page: 1,
      per_page: 6
    };

    this.loadProducts();
  }

  getPaginationRange(): number[] {
    const range: number[] = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      // For many pages, show limited range with current page in center
      let start = Math.max(1, this.currentPage - 1);
      let end = Math.min(this.totalPages, this.currentPage + 1);

      // Adjust the range if we're at the beginning or end
      if (this.currentPage <= 2) {
        end = 3;
      } else if (this.currentPage >= this.totalPages - 1) {
        start = this.totalPages - 2;
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }

    return range;
  }
}