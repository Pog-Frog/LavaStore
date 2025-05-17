import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { NotificationService } from '../../services/notification.service';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminLayoutComponent],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  searchQuery: string = '';
  categoryFilter: number = 0;
  
  // For product deletion
  showDeleteModal = false;
  productToDelete: Product | null = null;
  
  // For pagination
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  
  // For search debouncing
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCategories();
    this.loadProducts();
  }
  
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  
  setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchQuery = searchTerm;
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    // Use the new search endpoint
    this.productService.searchProducts({
      q: this.searchQuery,
      category_id: this.categoryFilter > 0 ? this.categoryFilter : undefined,
      page: this.currentPage,
      per_page: this.itemsPerPage,
      with: ['category']
    }).subscribe({
      next: (response) => {
        this.products = response.data.data;
        this.totalPages = response.data.last_page;
        this.filteredProducts = this.products; // No need to filter client-side
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error fetching products:', err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.showDeleteModal = false;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;
    
    this.productService.deleteProduct(this.productToDelete.id.toString()).subscribe({
      next: () => {
        this.notificationService.showSuccess('Product deleted successfully');
        this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
        this.showDeleteModal = false;
        this.productToDelete = null;
      },
      error: (err) => {
        this.notificationService.showError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    });
  }

  getPaginationRange(): number[] {
    const range: number[] = [];
    
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      // For many pages, show limited range with current page in center
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);
      
      // Adjust if we're near the end
      if (end === this.totalPages) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  }
}
