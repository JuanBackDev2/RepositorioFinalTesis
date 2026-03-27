import { Injectable, signal } from '@angular/core';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class PatientsServiceService {

  constructor(private http: HttpClient,
    private authService: AuthService) { }

    private _patients = signal<Patient[]>([]);
    patients = this._patients.asReadonly();

    currentPatient = signal<Patient | null>(null);

      // 🔥 NUEVO MÉTODO
    loadPatients() {
        const userId = this.authService.getUserId();

        if (!userId) return;

        this.http
          .get<Patient[]>(`/api/pacientes/?usuario=${userId}`)
          .subscribe({
            next: (data) => {
              this._patients.set(data); // 🔥 guarda en el service
            },
            error: (err) => {
              console.error('Error loading patients', err);
            }
          });
      }

    setCurrentPatient(patient: Patient) {
      this.currentPatient.set(patient);
    }

    getCurrentPatient() {
      return this.currentPatient();
    }

    addPatient(newPatient: Patient) {
      this._patients.update(list => [newPatient, ...list]);
    }

    createPatient(newPatient: Patient) {
      return this.http.post<Patient>(
        '/api/pacientes/',
        newPatient
      ).pipe(
        tap((created) => {
          this._patients.update(list => [created, ...list]);
        })
      );
}

getPatientById(id: number) {
  return this.http.get<Patient>(`/api/pacientes/${id}/`);
}

saveAnalysis(data: any) {
  return this.http.post('/api/diagnosticos/', data);
}

getReportsByPatient(pacienteId: number) {
  return this.http.get<any[]>(`/api/diagnosticos/?paciente=${pacienteId}`);
}

private selectedReport = signal<any>(null);

setReport(report: any) {
  this.selectedReport.set(report);
}

getReport() {
  return this.selectedReport();
}

}
