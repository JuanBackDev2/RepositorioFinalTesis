import { Component, HostListener, signal } from '@angular/core';
import { PatientsServiceService } from '../../services/patients-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalReport } from '../patients-history/patients-history.component';

@Component({
  selector: 'app-historyvisualizer',
  standalone: true,
  imports: [],
  templateUrl: './historyvisualizer.component.html',
  styleUrl: './historyvisualizer.component.css'
})
export class HistoryvisualizerComponent {
  patient: any;
  report:any;
  reports = signal<ClinicalReport[]>([]);

  constructor(private patientService:PatientsServiceService, private router:Router,
    private route: ActivatedRoute
  ){

  }
  ngOnInit() {
    this.report = this.patientService.getReport();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const reportId = this.route.snapshot.paramMap.get('reportId');

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

    const formatted = data.map(r => ({
      id: r.id,
      date: r.date,
      imageUrl: r.imageUrl,
      summary: r.summary,
      status: r.status
    }));

    // 🔥 FILTRAR SOLO EL REPORTE NECESARIO
    const selectedReport = formatted.find(r => r.id === reportId);
    console.log(reportId)
    console.log(formatted.forEach)
    if (selectedReport) {
      this.report = selectedReport;
    } else {
      console.error('Reporte no encontrado');
    }

  },
  error: (err) => {
    console.error('Error loading reports', err);
  }
});


  }

  downloadPDF() {
    console.log('Generating PDF for report:', this.report().id);
  }

  printReport() {
    window.print();
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
  
    

}
