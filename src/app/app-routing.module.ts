import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificareComponent } from './planificare/planificare.component';
import { CantarireComponent } from './cantarire/cantarire.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EditPlanificareComponent } from './planificare/planuri/edit-planificare/edit-planificare.component';
import { EditareTamburiComponent } from './planificare/tamburi/editare-tamburi/editare-tamburi.component';
import { NomfComponent } from './nomenclatoare/nomf/nomf.component';
import { NompComponent } from './nomenclatoare/nomp/nomp.component';
import { EditareBobineComponent } from './planificare/bobine/editare-bobine/editare-bobine.component';
import { NomlComponent } from './nomenclatoare/noml/noml.component';
import { UsersManagementComponent } from './users-management/users-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'planificare', component: PlanificareComponent, canActivate: [AuthGuard],
    children: [
      { path: "newPlan", component: EditPlanificareComponent },
      { path: "editPlan", component: EditPlanificareComponent },
      { path: "newTambur", component: EditareTamburiComponent },
      { path: "editTambur", component: EditareTamburiComponent },
      { path: "newBobina", component: EditareBobineComponent },
      { path: "editBobina", component: EditareBobineComponent }
    ]
  },
  
  { path: 'usersManagement', component: UsersManagementComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cantarire', component: CantarireComponent, canActivate: [AuthGuard] },
  { path: 'parteneri', component: NomfComponent, canActivate: [AuthGuard] },
  { path: 'produse', component: NompComponent, canActivate: [AuthGuard] },
  { path: 'lucrari', component: NomlComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
