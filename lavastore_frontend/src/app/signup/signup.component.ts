import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthComponent } from "../layouts/auth/auth.component";
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, AuthComponent],
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent {
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) { }

  passwordMatchValidator(control: AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      form.get('password_confirmation')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;

      const { name, email, password } = this.form.value;

      this.authService.register(name!, email!, password!, this.selectedFile).subscribe({
        next: () => {
          this.notificationService.showSuccess('Registration successful');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error.message || 'An error occurred during registration';
        }
      });
    } else {
      this.error = 'Please fill in all fields correctly';
    }
  }
}
