import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticViewerComponent } from '../diagnostic-viewer/diagnostic-viewer.component'
import { PatientsServiceService } from '../../services/patients-service.service'
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-retinopathy-grading',
  standalone: true,
  imports: [DiagnosticViewerComponent,CommonModule],
  templateUrl: './retinopathy-grading.component.html',
  styleUrl: './retinopathy-grading.component.css'
})
export class RetinopathyGradingComponent {
  predictionResult: any;
  currentPatient: any;
  patient: any;
  showSuccess = signal(false);
  constructor(private patientService: PatientsServiceService, private route: ActivatedRoute, private router: Router){

  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.patientService.setCurrentPatient(patient); // opcional
      },
      error: (err) => {
        console.error(err);
      }
    });

    console.log('Patient ID:', id);
    this.currentPatient = this.patientService.getCurrentPatient();
}

goToHistory() {
  const patient = this.patientService.getCurrentPatient();

  if (patient) {
    this.router.navigate(['/history', patient.id]);
  }
}

  handlePrediction(result: any) {
    this.predictionResult = result;
    console.log('Prediction received:', result);
  }
  currentImage: string = 'https://via.placeholder.com/500';


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

  saveAnalysis() {
    console.log('CLICKED 🔥');
    if (!this.predictionResult || !this.patient) {
      console.error('Missing data');
      return;
    }

    const payload = {
      paciente: this.patient.id,
      summary: this.predictionResult.predicted_class+ " : "+this.predictionResult.feedback,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      imageUrl: this.predictionResult.image_url,
      status: this.mapStatus(this.predictionResult.predicted_class)
    };

    console.log('Saving analysis:', payload);

    this.patientService.saveAnalysis(payload).subscribe({
      next: (res) => {
        console.log('Saved successfully', res);
        this.showSuccess.set(true);

      setTimeout(() => {
        this.showSuccess.set(false);
      }, 3000);
        
      },
      error: (err) => {
        console.error('Error saving analysis', err);
      }
    });
  }

  mapStatus(prediction: string): string {
  const mapping: { [key: string]: string } = {
    "No diabetic retinopathy": "STABLE",
    "Mild diabetic retinopathy": "SCHEDULED",
    "Moderate diabetic retinopathy": "SCHEDULED",
    "Severe diabetic retinopathy": "CRITICAL",
    "Proliferative diabetic retinopathy": "CRITICAL"
  };

  return mapping[prediction] || "PENDING";
}
}
