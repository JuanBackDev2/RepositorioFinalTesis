import { Routes } from '@angular/router';
import { RetinopathyGradingComponent } from './components/retinopathy-grading/retinopathy-grading.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientsHistoryComponent } from './components/patients-history/patients-history.component';
import { LandingComponent } from './components/landing/landing.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { authGuard } from './auth.guard';
import { HistoryvisualizerComponent } from './components/historyvisualizer/historyvisualizer.component';

export const routes: Routes = [
  { path: 'patientsDetail/:id', component: RetinopathyGradingComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'history/:id', component: PatientsHistoryComponent, canActivate: [authGuard] },
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'report-detail/:id/:reportId', component: HistoryvisualizerComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '' }
];
