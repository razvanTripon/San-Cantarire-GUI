import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgToggleModule} from '@nth-cloud/ng-toggle';

import { NgbTypeaheadModule, NgbDatepickerModule, NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { PlanificareComponent } from './planificare/planificare.component';
import { CantarireComponent } from './cantarire/cantarire.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarCloseComponent } from './navbar-close/navbar-close.component';
import { HeaderComponent } from './header/header.component';
import { MenuPlanificareComponent } from './planificare/planuri/menu-planificare/menu-planificare.component';
import { GridPlanificareComponent } from './planificare/planuri/grid-planificare/grid-planificare.component';
import { EditPlanificareComponent } from './planificare/planuri/edit-planificare/edit-planificare.component';
import { MenuTamburiComponent } from './planificare/tamburi/menu-tamburi/menu-tamburi.component';
import { GridTamburiComponent } from './planificare/tamburi/grid-tamburi/grid-tamburi.component';
import { DropdownDirective } from './_services/directive.dropDown';
import { EditareTamburiComponent } from './planificare/tamburi/editare-tamburi/editare-tamburi.component';
import { AlertComponent } from './_shared/alert/alert.component';
import { NomfComponent } from './nomenclatoare/nomf/nomf.component';
import { MeniuNomfComponent } from './nomenclatoare/nomf/meniu-nomf/meniu-nomf.component';
import { EditNomfComponent } from './nomenclatoare/nomf/edit-nomf/edit-nomf.component';
import { NompComponent } from './nomenclatoare/nomp/nomp.component';
import { MeniuNompComponent } from './nomenclatoare/nomp/meniu-nomp/meniu-nomp.component';
import { EditNompComponent } from './nomenclatoare/nomp/edit-nomp/edit-nomp.component';
import { GridBobineComponent } from './planificare/bobine/grid-bobine/grid-bobine.component';
import { EditareBobineComponent } from './planificare/bobine/editare-bobine/editare-bobine.component';
import { MenuBobineComponent } from './planificare/bobine/menu-bobine/menu-bobine.component';
import { NomlComponent } from './nomenclatoare/noml/noml.component';
import { EditNomlComponent } from './nomenclatoare/noml/edit-noml/edit-noml.component';
import { MeniuNomlComponent } from './nomenclatoare/noml/meniu-noml/meniu-noml.component';
import { AutocompleteComponent } from './_shared/autocomplete/autocomplete.component';
import { ConfirmationDialogComponent } from './_shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './_shared/confirmation-dialog/confirmation-dialog.service';
import { AdvanceSearchComponent } from './_shared/advance-search/advance-search.component';
import { AdvanceSearchService } from './_shared/advance-search/advance-search.service';
import { EditNomfService } from './nomenclatoare/nomf/edit-nomf/edit-nomf.service';
import { EditNompService } from './nomenclatoare/nomp/edit-nomp/edit-nomp.service';
import { EditNomlService } from './nomenclatoare/noml/edit-noml/edit-noml.service';
import { EditAnexaNomlComponent } from './nomenclatoare/noml/edit-anexa-noml/edit-anexa-noml.component';
import { EditAnexaNomlService } from './nomenclatoare/noml/edit-anexa-noml/edit-anexa-noml.service';
import { EditAnexa2NomlComponent } from './nomenclatoare/noml/edit-anexa-noml/edit-anexa2-noml/edit-anexa2-noml.component';
import { EditAnexa2NomlService } from './nomenclatoare/noml/edit-anexa-noml/edit-anexa2-noml/edit-anexa2-noml.service';
import { CantarireGridTamburiComponent } from './cantarire/cantarire-grid-tamburi/cantarire-grid-tamburi.component';
import { CantarireGridBobineComponent } from './cantarire/cantarire-grid-bobine/cantarire-grid-bobine.component';
import { CantarireGridProduseComponent } from './cantarire/cantarire-grid-produse/cantarire-grid-produse.component';
import { EditareProduseComponent } from './cantarire/cantarire-grid-produse/editare-produse/editare-produse.component';
import { EditareCantarireProduseService } from './cantarire/cantarire-grid-produse/editare-produse/editare-produse.service';
import { MenuLoadPlanComponent } from './cantarire/cantarire-grid-tamburi/menu-load-plan/menu-load-plan.component';
import { EditSetariCantarireComponent } from './cantarire/cantarire-grid-tamburi/menu-load-plan/edit-setari-cantarire/edit-setari-cantarire.component';
import { EditSetariCantarireService } from './cantarire/cantarire-grid-tamburi/menu-load-plan/edit-setari-cantarire/edit-setari-cantarire.service';
import { UsersManagementComponent } from './users-management/users-management.component';
import { EditUserComponent } from './users-management/edit-user/edit-user.component';
import { MeniuUsersComponent } from './users-management/meniu-users/meniu-users.component';
import { EditUserService } from './users-management/edit-user/edit-user.service';

@NgModule({
  declarations: [
    DropdownDirective,
    AppComponent,
    PlanificareComponent,
    HeaderComponent,
    CantarireComponent,
    LoginComponent,
    HomeComponent,
    NavbarCloseComponent,
    MenuPlanificareComponent,
    GridPlanificareComponent,
    EditPlanificareComponent,
    MenuTamburiComponent,
    GridTamburiComponent,    
    EditareTamburiComponent,
    AlertComponent,
    NomfComponent,
    MeniuNomfComponent,
    EditNomfComponent,
    NompComponent,
    MeniuNompComponent,
    EditNompComponent,
    GridBobineComponent,
    EditareBobineComponent,
    MenuBobineComponent,
    NomlComponent,
    EditNomlComponent,
    MeniuNomlComponent,
    AutocompleteComponent,
    ConfirmationDialogComponent,
    AdvanceSearchComponent,
    EditAnexaNomlComponent,
    EditAnexa2NomlComponent,
    MenuLoadPlanComponent,
    CantarireGridTamburiComponent,
    CantarireGridBobineComponent,
    CantarireGridProduseComponent,
    EditareProduseComponent,
    EditSetariCantarireComponent,
    UsersManagementComponent,
    EditUserComponent,
    MeniuUsersComponent
  ],
  imports: [
    NgToggleModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbModule,
    AgGridModule.withComponents([])
  ],
  providers: [ConfirmationDialogService, AdvanceSearchService, EditNomfService, EditNompService, EditNomlService,EditAnexaNomlService,EditAnexa2NomlService,EditareCantarireProduseService,EditSetariCantarireService,EditUserService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent, AdvanceSearchComponent, EditNomfComponent, EditNompComponent, EditNomlComponent,EditAnexaNomlComponent,EditAnexa2NomlComponent,EditareProduseComponent,EditSetariCantarireComponent,EditUserComponent]
})
export class AppModule { }
