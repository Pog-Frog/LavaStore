import { Routes } from '@angular/router';
import { BaseComponent } from './layouts/base/base.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/signin', component: SigninComponent },
    { path: 'products', component: ProductsHomeComponent, canActivate: [authGuard] },
];
