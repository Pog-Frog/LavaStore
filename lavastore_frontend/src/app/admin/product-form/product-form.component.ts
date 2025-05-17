import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { Category, DietaryPreference, Product } from '../../models/product.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, AdminLayoutComponent],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    categories: Category[] = [];
    dietaryPreferences: DietaryPreference[] = [];
    loading = false;
    isEditMode = false;
    productId: string | null = null;
    imagePreview: string | null = null;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            price: ['', [Validators.required, Validators.min(0.01)]],
            original_price: [''],
            category_id: ['', Validators.required],
            is_featured: [false],
            badge: [''],
            image_url: [''], // Changed from 'image: [null]'
            dietary_preferences: [[]],
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadDietaryPreferences();

        // Check if we're in edit mode
        this.productId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.productId;

        if (this.isEditMode && this.productId) {
            this.loadProduct(parseInt(this.productId));
        }
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (response) => {
                this.categories = response.data;
            },
            error: (err) => {
                this.notificationService.showError('Failed to load categories');
                console.error('Error loading categories:', err);
            }
        });
    }

    loadDietaryPreferences(): void {
        // This would typically call a service method to fetch dietary preferences
        // For now, we'll use some sample data
        this.dietaryPreferences = [
            { id: 1, name: 'Vegan' },
            { id: 2, name: 'Gluten-Free' },
            { id: 3, name: 'Organic' },
            { id: 4, name: 'Sugar-Free' },
            { id: 5, name: 'Dairy-Free' },
            { id: 6, name: 'Nut-Free' },
            { id: 7, name: 'Keto' },
            { id: 8, name: 'Paleo' },
            { id: 9, name: 'Low-Carb' },
            { id: 10, name: 'Sugar-Free' }
        ];
    }

    loadProduct(id: number): void {
        this.loading = true;

        this.productService.getProduct(id).subscribe({
            next: (response) => {
                const product = response.data;

                // Populate form with product data
                this.productForm.patchValue({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    original_price: product.original_price,
                    category_id: product.category?.id,
                    is_featured: product.is_featured,
                    badge: product.badge,
                    image_url: product.image_url, // Set image URL directly
                    dietary_preferences: product.dietary_preferences?.map(dp => dp.id) || []
                });
                
                // Set image preview if URL is available
                if (product.image_url) {
                    this.imagePreview = product.image_url;
                }

                this.loading = false;
            },
            error: (err) => {
                this.notificationService.showError('Failed to load product details');
                console.error('Error loading product:', err);
                this.loading = false;
            }
        });
    }

    onImageUrlChange(): void {
        const imageUrl = this.productForm.get('image_url')!.value;
        if (imageUrl) {
            this.imagePreview = imageUrl;
        }
    }

    clearImageUrl(): void {
        this.productForm.patchValue({ image_url: '' });
        this.imagePreview = null;
    }

    toggleDietaryPreference(prefId: number): void {
        const preferences = this.productForm.get('dietary_preferences')!.value as number[] || [];

        if (preferences.includes(prefId)) {
            this.productForm.patchValue({
                dietary_preferences: preferences.filter(id => id !== prefId)
            });
        } else {
            this.productForm.patchValue({
                dietary_preferences: [...preferences, prefId]
            });
        }
    }

    isPreferenceSelected(prefId: number): boolean {
        const preferences = this.productForm.get('dietary_preferences')!.value as number[] || [];
        return preferences.includes(prefId);
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            // Mark all fields as touched to trigger validation messages
            Object.keys(this.productForm.controls).forEach(key => {
                this.productForm.get(key)?.markAsTouched();
            });
            this.notificationService.showError('Please fill in all required fields correctly');
            return;
        }
        
        this.loading = true;
        
        const productData = this.productForm.value;
        
        // No need for special image handling - just submit the form values directly
        
        if (this.isEditMode && this.productId) {
            this.productService.updateProduct(this.productId, productData).subscribe({
                next: (product) => {
                    this.notificationService.showSuccess('Product updated successfully');
                    this.loading = false;
                    this.router.navigate(['/admin/products']);
                },
                error: (err) => {
                    this.notificationService.showError('Failed to update product');
                    console.error('Error updating product:', err);
                    this.loading = false;
                }
            });
        } else {
            this.productService.createProduct(productData).subscribe({
                next: (product) => {
                    this.notificationService.showSuccess('Product created successfully');
                    this.loading = false;
                    this.router.navigate(['/admin/products']);
                },
                error: (err) => {
                    this.notificationService.showError('Failed to create product');
                    console.error('Error creating product:', err);
                    this.loading = false;
                }
            });
        }
    }

    // Helper method to check form control validity
    isInvalid(controlName: string): boolean {
        const control = this.productForm.get(controlName);
        return !!control && control.invalid && (control.dirty || control.touched);
    }
}
