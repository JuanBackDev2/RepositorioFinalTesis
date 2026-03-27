import { Component, HostListener, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsServiceService } from '../../services/patients-service.service';
import { Patient } from '../../models/patient.model';


export interface ClinicalReport {
  id: string;
  date: string;
  imageUrl: string;
  summary: string;
  status: 'REVIEWED' | 'PENDING';
}

@Component({
  selector: 'app-patients-history',
  standalone: true,
  imports: [],
  templateUrl: './patients-history.component.html',
  styleUrl: './patients-history.component.css'
})


export class PatientsHistoryComponent {
  reports = signal<ClinicalReport[]>([]);
  patient: any;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientsServiceService,
     private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));


    this.patientService.getPatientById(id).subscribe({
    next: (patient) => {
      this.patient = patient;
      this.patientService.setCurrentPatient(patient); // opcional
    },
    error: (err) => {
      console.error(err);
    }});

    this.patientService.getReportsByPatient(id).subscribe({
    next: (data) => {
      console.log('Reports from backend:', data);

      const formatted = data.map(r => ({
        id: r.id,
        date: r.date,
        imageUrl: r.imageUrl,
        summary: r.summary,
        status: r.status
      }));

      this.reports.set(formatted); // 🔥 actualiza signal
    },
    error: (err) => {
      console.error('Error loading reports', err);
    }
   });
  //const patients = this.patientService.patients();

  //this.patient = patients.find(p => p.id === id);
  }

  goToPatient() {
      this.patientService.setCurrentPatient(this.patient);
      this.router.navigate(['/patientsDetail', this.patient.id]);
  }

  selectedImage: string | null = null;

  openImage(url: string) {
    this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
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

    viewReport(report: any) {
    this.patientService.setReport(report);
    this.router.navigate(['/report-detail',this.patient.id,report.id]);
}
}
