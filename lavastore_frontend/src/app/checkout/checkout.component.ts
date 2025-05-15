import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { HomeComponent } from '../layouts/home/home.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';


@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HomeComponent],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    formData: FormGroup;
    total: number = 0;
    loading: boolean = false;
    error: string | null = null;
    private subscription: Subscription = new Subscription();

    constructor(
        public cartService: CartService,
        private fb: FormBuilder,
        private http: HttpClient,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.formData = this.fb.group({
            // firstName: ['', Validators.required],
            // lastName: ['', Validators.required],
            // email: ['', [Validators.required, Validators.email]],
            // phone: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zipCode: ['', Validators.required],
            paymentMethod: ['credit_card', Validators.required],
            cardNumber: ['', Validators.required],
            cardName: ['', Validators.required],
            expiryDate: ['', Validators.required],
            cvv: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.subscription.add(
            this.cartService.getCartItemsObservable().subscribe(() => {
                this.total = this.cartService.getCartTotal();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity > 0) {
            this.cartService.updateQuantity(productId, quantity);
        }
    }

    removeItem(productId: number): void {
        this.cartService.removeFromCart(productId);
    }

    onSubmit(): void {
        if (this.formData.invalid) {
            this.notificationService.showError('Please fill in all required fields');
            return;
        }

        if (this.cartService.getCartTotal() === 0) {
            this.notificationService.showError('Your cart is empty');
            return;
        }

        this.loading = true;
        this.error = null;

        const cartItems = this.cartService.getCartItems().map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.price,
        }));

        const orderData = {
            items: cartItems
        };

        this.http.post(`${environment.apiUrl}/orders`, orderData)
            .subscribe({
                next: (response: any) => {
                    this.loading = false;
                    this.cartService.clearCart();
                    this.notificationService.showSuccess('Order placed successfully');
                    this.router.navigate(['/orders']);
                },
                error: (error) => {
                    this.loading = false;
                    if(error.status === 401) {
                        this.notificationService.showError('You must be logged in to place an order');
                        this.router.navigate(['/auth/signin']);
                    } else {
                        this.notificationService.showError('Error placing order');
                    }
                }
            });
    }
} 