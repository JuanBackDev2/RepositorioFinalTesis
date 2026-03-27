import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientsServiceService } from '../../services/patients-service.service';
import { Patient } from '../../models/patient.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})

export class PatientsComponent {

  patients = this.patientService.patients;

  ngOnInit() {
    this.patientService.loadPatients();
  }
  
  // 1. State Management with Signals
  isModalOpen = signal(false);
  searchQuery = signal('');
  

  // 2. Computed Search Filtering
  filteredPatients = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.patients().filter(p => 
      p.name.toLowerCase().includes(query)
    );
  });

  // 3. Form Initialization
  patientForm: FormGroup;

  constructor(private fb: FormBuilder, private patientService: PatientsServiceService,
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService) {
    
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: [null, [Validators.required, Validators.min(0)]],
      gender: ['Female', Validators.required],
      status: ['STABLE', Validators.required]
    });

    
  }

  goToPatient(p: Patient) {
    this.patientService.setCurrentPatient(p);
    this.router.navigate(['/patientsDetail', p.id]);
}

  // 4. Modal Control Logic
  openModal() {
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.patientForm.reset({ gender: 'Female', status: 'STABLE' });
    document.body.style.overflow = 'auto';
  }

  // 5. Submit Logic
  onSubmit() {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      const newPatient: Patient = {
      ...formValue,
      usuario: this.authService.getUserId(),
      lastVisit: new Date().toLocaleDateString('en-CA')
    };

      // Update the signal list
      //this.patients.update(list => [newPatient, ...list]);
      this.patientService.createPatient(newPatient).subscribe({
          next: () => {
            this.closeModal();
          },
          error: (err:any) => {
            console.error(err);
          }
        });
      console.log(this.patients)
      
    }
  }

  isOpen = signal(false);
  
    toggleDropdown() {
      this.isOpen.update(v => !v);
    }
  
    closeDropdown() {
      this.isOpen.set(false);
    }
  
    onLogout() {
      console.log('Logging out...');
      // Add authentication logout logic here
      localStorage.removeItem('userId'); // 🔥 clave
  
      this.closeDropdown();
      this.router.navigate(['/signin']); // redirigir
    }
  
    navigateToDashboard() {
      console.log('Navigating to dashboard...');
      this.router.navigate(['/patients']);
      this.closeDropdown();
    }
  
    @HostListener('document:click', ['$event'])
    handleClick(event: Event) {
      const target = event.target as HTMLElement;
  
      // Si no se hizo click dentro del dropdown
      if (!target.closest('.dropdown-container')) {
        this.closeDropdown();
      }
    }
  
}