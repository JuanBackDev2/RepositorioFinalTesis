import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } 
from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {

  signUpForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder,
  private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      medicalId: '',
      hospital: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      this.isSubmitting.set(true);
      
      console.log('Registration Data:', this.signUpForm.value);
      
      const form = this.signUpForm.value;

    const payload = {
      username: form.fullName.replace(/\s+/g, '').toLowerCase() + '_' + form.medicalId,
      email: form.email,
      password: form.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('User created:', res);

        // GUARDAR SESIÓN
        localStorage.setItem('userId', res.id);
        // REDIRIGIR
        this.router.navigate(['/patients']);

        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting.set(false);
      }
    });
    }
  }

  logIn(){
    this.router.navigate(['/signin']);
  }
}
