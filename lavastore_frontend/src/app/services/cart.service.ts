import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.interface';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private showCartModal = new BehaviorSubject<boolean>(false);
  showCartModal$ = this.showCartModal.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.updateCart([...currentItems]);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product_id: product.id,
        quantity: quantity,
        price: product.price,
        product: product
      };
      this.updateCart([...currentItems, newItem]);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    this.updateCart(currentItems.filter(item => item.product_id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.product_id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart([...currentItems]);
    }
  }

  clearCart() {
    this.updateCart([]);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemsCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  toggleCartModal() {
    this.showCartModal.next(!this.showCartModal.value);
  }

  private updateCart(items: CartItem[]) {
    this.cartItems.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }
} 