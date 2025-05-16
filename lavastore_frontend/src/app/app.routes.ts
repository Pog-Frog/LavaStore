import { Routes } from '@angular/router';
import { BaseComponent } from './layouts/base/base.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { notAuthenticatedGuard } from './guards/notAuthenticated';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: 'about', component: AboutComponent },
    { path: 'auth/signup', component: SignupComponent, canActivate: [notAuthenticatedGuard] },
    { path: 'auth/signin', component: SigninComponent, canActivate: [notAuthenticatedGuard] },
    { path: 'products', component: ProductsHomeComponent, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    
    // Admin Routes
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AdminGuard] },
];
