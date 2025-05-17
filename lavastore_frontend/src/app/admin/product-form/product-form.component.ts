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
            image: [null],
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
                    dietary_preferences: product.dietary_preferences?.map(dp => dp.id) || []
                });
                console.log('Product loaded:', product);

                // Set image preview if available
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

    onImageSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.productForm.patchValue({ image: file });

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
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
        console.log(this.productForm.value);

        this.loading = true;

        // Create FormData for the API request (to handle file upload)
        const formData = new FormData();

        // Append all form fields to FormData
        Object.keys(this.productForm.value).forEach(key => {
            if (key === 'image' && this.productForm.get('image')!.value) {
                formData.append('image', this.productForm.get('image')!.value);
            }
            else if (key === 'dietary_preferences') {
                const preferences = this.productForm.get('dietary_preferences')!.value as number[];
                if (preferences && preferences.length) {
                    preferences.forEach(prefId => {
                        formData.append('dietary_preferences[]', prefId.toString());
                    });
                }
            }
            else if (this.productForm.get(key)!.value !== null && this.productForm.get(key)!.value !== undefined) {
                formData.append(key, this.productForm.get(key)!.value);
            }
        });

        if (this.isEditMode && this.productId) {
            // Update existing product
            this.productService.updateProduct(this.productId, formData).subscribe({
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
            // Create new product
            this.productService.createProduct(formData).subscribe({
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
