import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } 
from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PatientsServiceService } from '../../services/patients-service.service';
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  signInForm: FormGroup;
  isAuthenticating = signal(false);
  errorMessage = signal('');

  constructor(private fb: FormBuilder,
  private authService: AuthService,
  private router: Router, private patientService: PatientsServiceService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  async onSignIn() {
    if (this.signInForm.valid) {
      this.isAuthenticating.set(true);
      this.errorMessage.set('');
      
      const form = this.signInForm.value;

      this.authService.login({
        email: form.email,
        password: form.password
      }).subscribe({
        next: (res: any) => {
          console.log('Login success:', res);

          // ✅ guardar sesión
          localStorage.setItem('userId', res.id);
          this.router.navigate(['/patients']);
          this.patientService.loadPatients(); // 🔥 aquí

          this.isAuthenticating.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Invalid credentials');
          this.isAuthenticating.set(false);

              setTimeout(() => {
        this.errorMessage.set('');
      }, 2500);
        }
      });
    }
  }

  irAsignUp(){
    console.log("here")
    this.router.navigate(['/signup']);
  }
}
