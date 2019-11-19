import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from '../_shared/alert/alert.service';
import { ModalNompService } from '../nomenclatoare/nomp/modal-nomp.service';
import { ModalNomfService } from '../nomenclatoare/nomf/modal-nomf.service';
import { FilterDateTimeService } from '../_shared/filter-date-time/filter-date-time.service';
import { RapoarteService } from '../rapoarte/rapoarte.service';
import { ModalEtichetaManualaService } from '../rapoarte/listare-manuala-eticheta/modal-eticheta-manuala.service';
import { ModalViewLogsService } from '../view-logs/modal-view-logs.service';
import { EditSetariCantarireService } from '../utilitare/edit-setari-cantarire/edit-setari-cantarire.service';
import { BackupService } from '../utilitare/backup/backup.service';
import { Subscription } from 'rxjs';
import { ModalBobineWMSService } from '../utilitare/expot-wms/modal-bobine-wms.service';
import { HttpClient } from '@angular/common/http';
import { SetariGeneraleService } from '../_services/setari-generale.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  navbarOpen = false;
  showUtilitare = false;
  showHeader = true;
  subscriptionUser: Subscription;
  subscriptionShow: Subscription;

  constructor(
    public auth: AuthenticationService,
    public router: Router,
    private alertService: AlertService,
    private editSetariCantarireService: EditSetariCantarireService,
    private modalNomp: ModalNompService,
    private modalNomf: ModalNomfService,
    private backupService: BackupService,
    private filterDateFime: FilterDateTimeService,
    private raporteService: RapoarteService,
    private listareManualaEtich: ModalEtichetaManualaService,
    private serviceviewLogs: ModalViewLogsService,
    private modalBobinWMS: ModalBobineWMSService,
  ) {

  }
  ngOnInit() {
    this.subscriptionUser = this.auth.currentUser$.subscribe(userName => {
      if (userName) {
        if (userName == "admin") this.showUtilitare = true;
        else this.showUtilitare = false
      }
    })
    this.subscriptionShow = this.auth.showHeader$.subscribe(flag => {
      if (flag) {
        this.showHeader = true;
      } else
        this.showHeader = false;
    })

  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logOut() {
    this.auth.logout();
  }

  onUserManagement() {
    this.router.navigate(["usersManagement"])
  }

  openConfigurari() {
    this.editSetariCantarireService.openEditare()
  }

  openModalNomp() {
    this.modalNomp.openNompModal();
  }

  openModalNomf() {
    this.modalNomf.openNomfModal();
  }

  sendToWMS() {
    this.modalBobinWMS.showModal();
  }

  backUpNow() {
    this.alertService.emitAlert({
      type: "info",
      message: `A fost lansat serviciul de backup. La finalizarea salvarii si sincronizarii datelor in Cloud veti fi notificat. Salvarea dureaza aporximatim 1 minut.`,
      time: 8000,
      size: "w-50"
    })
    this.backupService.backupNow();
  }

  runRap(type: "raportDetaliat" | "raportSumar" | "notaPredare") {
    let title = ""
    if (type == "raportDetaliat") title = 'Raport detaliat productie selectie perioada'
    if (type == "raportSumar") title = 'Raport sumar productie selectie perioada'
    if (type == "notaPredare") title = 'Nota de predare selectie perioada'

    this.filterDateFime.getParams(title).then(dataParams => {
      if (dataParams) {
        this.raporteService.downloadRepo(type, dataParams);
      }
    })
  }

  listareEtichManuala() {
    this.listareManualaEtich.openModal()
  }

  viewLogs() {
    this.serviceviewLogs.openModalView()
  }

  ngOnDestroy() {
    this.subscriptionUser.unsubscribe();
    this.subscriptionShow.unsubscribe();

  }
}
