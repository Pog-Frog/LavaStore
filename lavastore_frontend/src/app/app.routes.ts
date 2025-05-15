import { Routes } from '@angular/router';
import { BaseComponent } from './layouts/base/base.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { notAuthenticatedGuard } from './guards/notAuthenticated';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: 'auth/signup', component: SignupComponent, canActivate: [notAuthenticatedGuard] },
    { path: 'auth/signin', component: SigninComponent, canActivate: [notAuthenticatedGuard] },
    { path: 'products', component: ProductsHomeComponent, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
];
