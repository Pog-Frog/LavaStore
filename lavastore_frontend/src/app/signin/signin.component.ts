import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthComponent } from "../layouts/auth/auth.component";

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule, AuthComponent],
  templateUrl: './signin.component.html',
  styles: []
})
export class SigninComponent {
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;

      const { email, password } = this.form.value;

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error.message || 'An error occurred during sign in';
        }
      });
    }
  }
}
