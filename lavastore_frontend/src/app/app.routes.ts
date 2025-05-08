import { Routes } from '@angular/router';
import { BaseComponent } from './layouts/base/base.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/signin', component: SigninComponent },
];
