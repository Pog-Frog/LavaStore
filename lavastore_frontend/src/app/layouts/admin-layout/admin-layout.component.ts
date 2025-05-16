import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = false;
  profileMenuOpen = false;
  currentUser: any;
  baseUrl = environment.apiUrl;
  storageUrl = environment.storageUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        
        if (!user?.is_admin) {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.router.navigate(['/auth/signin']);
      }
    });

    document.addEventListener('click', this.closeProfileMenuOnClickOutside.bind(this));
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    
    if (this.sidebarOpen) {
      this.profileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenuOnClickOutside(event: Event): void { 
    const profileMenu = document.querySelector('.profile-menu');
    
    if(profileMenu && !profileMenu.contains(event.target as Node)) {
      this.profileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
