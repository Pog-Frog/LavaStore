import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  currentUser: User | null = null;
  selectedFile: File | null = null;
  profilePicturePreview: string | ArrayBuffer | null = null;
  defaultProfilePic = 'https://via.placeholder.com/150';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.profilePicturePreview = user?.profile_picture_url ? `${environment.storageUrl}${user.profile_picture_url}` : this.defaultProfilePic;
      this.initForm();
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [this.currentUser?.name || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      profile_picture: [null]
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList[0]) {
      this.selectedFile = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicturePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.profilePicturePreview = this.currentUser?.profile_picture_url ? this.currentUser.profile_picture_url : this.defaultProfilePic;
      this.form.patchValue({ profile_picture: null });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = "Please correct the errors in the form.";
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    const formData = this.form.value;
    const updatePayload: { name?: string; email?: string; password?: string; profile_picture_file?: File | null } = {};

    if (formData.name !== this.currentUser?.name) {
      updatePayload.name = formData.name;
    }
    if (formData.email !== this.currentUser?.email) {
      updatePayload.email = formData.email;
    }
    if (formData.password) {
      updatePayload.password = formData.password;
    }
    if (this.selectedFile) {
      updatePayload.profile_picture_file = this.selectedFile;
    }
    
    if (Object.keys(updatePayload).length === 0) {
        this.successMessage = "No changes detected.";
        this.isLoading = false;
        return;
    }


    this.authService.updateUser(updatePayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.currentUser = response.data;
        this.profilePicturePreview = response.data?.profile_picture_url ? `${environment.storageUrl}${response.data.profile_picture_url}` : this.defaultProfilePic;
          this.selectedFile = null;
        this.form.get('profile_picture')?.reset(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'An error occurred during profile update.';
        console.error(err);
      }
    });
  }
}
