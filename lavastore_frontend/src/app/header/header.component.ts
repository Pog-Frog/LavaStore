import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService, User } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;
  cartItemsCount = 0;
  isLoggedIn = false;
  isAdmin = false;
  currentUser: User | null = null;
  baseUrl = environment.storageUrl;
  
  private authSubscription: Subscription | null = null;

  constructor(
    public cartService: CartService, 
    public authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItemsObservable().subscribe(items => {
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });
    
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
    
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.currentUser = this.authService.currentUserValue;
    
    document.addEventListener('click', this.closeDropdownsOnClickOutside.bind(this));
  }
  
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    document.removeEventListener('click', this.closeDropdownsOnClickOutside.bind(this));
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  
  toggleUserDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  
  closeUserDropdown(): void {
    this.isUserDropdownOpen = false;
  }
  
  closeDropdownsOnClickOutside(event: Event): void {
    const userDropdownContainer = document.querySelector('.user-dropdown-container');
    
    if (userDropdownContainer && !userDropdownContainer.contains(event.target as Node)) {
      this.isUserDropdownOpen = false;
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
    this.isUserDropdownOpen = false;
  }
}