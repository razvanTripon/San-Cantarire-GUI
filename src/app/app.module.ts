import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgToggleModule } from '@nth-cloud/ng-toggle';

import { NgbTypeaheadModule, NgbDatepickerModule, NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { CantarireComponent } from './cantarire/cantarire.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarCloseComponent } from './navbar-close/navbar-close.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './_services/directive.dropDown';
import { AlertComponent } from './_shared/alert/alert.component';
import { NomfComponent } from './nomenclatoare/nomf/nomf.component';
import { MeniuNomfComponent } from './nomenclatoare/nomf/meniu-nomf/meniu-nomf.component';
import { EditNomfComponent } from './nomenclatoare/nomf/edit-nomf/edit-nomf.component';
import { NompComponent } from './nomenclatoare/nomp/nomp.component';
import { MeniuNompComponent } from './nomenclatoare/nomp/meniu-nomp/meniu-nomp.component';
import { EditNompComponent } from './nomenclatoare/nomp/edit-nomp/edit-nomp.component';
import { AutocompleteComponent } from './_shared/autocomplete/autocomplete.component';
import { ConfirmationDialogComponent } from './_shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './_shared/confirmation-dialog/confirmation-dialog.service';
import { AdvanceSearchComponent } from './_shared/advance-search/advance-search.component';
import { AdvanceSearchService } from './_shared/advance-search/advance-search.service';
import { EditNomfService } from './nomenclatoare/nomf/edit-nomf/edit-nomf.service';
import { EditNompService } from './nomenclatoare/nomp/edit-nomp/edit-nomp.service';
import { CantarireGridProduseComponent } from './cantarire/cantarire-grid-produse/cantarire-grid-produse.component';
import { EditareProduseComponent } from './cantarire/cantarire-grid-produse/editare-produse/editare-produse.component';
import { EditareCantarireProduseService } from './cantarire/cantarire-grid-produse/editare-produse/editare-produse.service';
import { RaportDetaliatComponent } from './rapoarte/raport-detaliat/raport-detaliat.component';
import { RaportSumarComponent } from './rapoarte/raport-sumar/raport-sumar.component';
import { NotaPredareComponent } from './rapoarte/nota-predare/nota-predare.component';
import { FilterDateTimeComponent } from './_shared/filter-date-time/filter-date-time.component';
import { FilterDateTimeService } from './_shared/filter-date-time/filter-date-time.service';
import { ComenziComponent } from './cantarire/comenzi/comenzi.component';
import { EditComenziComponent } from './cantarire/comenzi/edit-comenzi/edit-comenzi.component';
import { EditComenziService } from './cantarire/comenzi/edit-comenzi/edit-comenzi.service';
import { ModalNompService } from './nomenclatoare/nomp/modal-nomp.service';
import { ModalNomfService } from './nomenclatoare/nomf/modal-nomf.service';
import { ListareManualaEtichetaComponent } from './rapoarte/listare-manuala-eticheta/listare-manuala-eticheta.component';
import { ModalEtichetaManualaService } from './rapoarte/listare-manuala-eticheta/modal-eticheta-manuala.service';
import { EditSetariCantarireComponent } from './utilitare/edit-setari-cantarire/edit-setari-cantarire.component';
import { EditSetariCantarireService } from './utilitare/edit-setari-cantarire/edit-setari-cantarire.service';
import { UsersManagementComponent } from './utilitare/users-management/users-management.component';
import { EditUserComponent } from './utilitare/users-management/edit-user/edit-user.component';
import { MeniuUsersComponent } from './utilitare/users-management/meniu-users/meniu-users.component';
import { EditUserService } from './utilitare/users-management/edit-user/edit-user.service';
import { ExpotWMSComponent } from './utilitare/expot-wms/expot-wms.component';
import { ModalBobineWMSService } from './utilitare/expot-wms/modal-bobine-wms.service';
import { ViewLogsComponent } from './utilitare/view-logs/view-logs.component';
import { ModalViewLogsService } from './utilitare/view-logs/modal-view-logs.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    DropdownDirective,
    AppComponent,
    HeaderComponent,
    CantarireComponent,
    LoginComponent,
    HomeComponent,
    NavbarCloseComponent,
    AlertComponent,
    NomfComponent,
    MeniuNomfComponent,
    EditNomfComponent,
    NompComponent,
    MeniuNompComponent,
    EditNompComponent,
    AutocompleteComponent,
    ConfirmationDialogComponent,
    AdvanceSearchComponent,
    CantarireGridProduseComponent,
    EditareProduseComponent,
    EditSetariCantarireComponent,
    UsersManagementComponent,
    EditUserComponent,
    MeniuUsersComponent,
    RaportDetaliatComponent,
    RaportSumarComponent,
    NotaPredareComponent,
    FilterDateTimeComponent,
    ComenziComponent,
    EditComenziComponent,
    ListareManualaEtichetaComponent,
    ViewLogsComponent,
    ExpotWMSComponent
  ],
  imports: [
    NgToggleModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbModule,
    AgGridModule.withComponents([]),
    NoopAnimationsModule,
  ],
  providers: [ConfirmationDialogService, AdvanceSearchService, EditNomfService, EditNompService, EditareCantarireProduseService, EditSetariCantarireService, EditUserService, FilterDateTimeService, EditComenziService, ModalNompService, ModalNomfService,ModalEtichetaManualaService,ModalViewLogsService,ModalBobineWMSService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent, AdvanceSearchComponent, EditNomfComponent, EditNompComponent, EditareProduseComponent, EditSetariCantarireComponent, EditUserComponent, FilterDateTimeComponent, EditComenziComponent, NompComponent, NomfComponent,ListareManualaEtichetaComponent,ViewLogsComponent,ExpotWMSComponent]
})
export class AppModule { }
