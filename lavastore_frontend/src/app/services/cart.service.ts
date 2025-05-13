import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private showCartModal$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems$.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems$.value;
  }

  getCartItemsObservable(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  getCartTotal(): number {
    let total = this.cartItems$.value.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
    return parseFloat(total.toFixed(2));
  }

  getCartItemsCount(): number {
    return this.cartItems$.value.reduce((count: number, item: CartItem) => count + item.quantity, 0);
  }

  toggleCartModal() {
    this.showCartModal$.next(!this.showCartModal$.value);
  }

  getShowCartModal(): Observable<boolean> {
    return this.showCartModal$.asObservable();
  }

  private updateCart(items: CartItem[]) {
    this.cartItems$.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems$.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.updateCart([...currentItems]);
    } else {
      this.updateCart([...currentItems, { product, quantity, price: product.price }]);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems$.value;
    this.updateCart(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems$.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart([...currentItems]);
    }
  }

  clearCart() {
    this.updateCart([]);
  }
} 