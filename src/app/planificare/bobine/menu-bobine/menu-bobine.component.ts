import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TamburiService } from '../../tamburi/tamburi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanificareModel } from '../../_models/planificare.model';
import { BobineService } from '../bobine.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-menu-bobine',
  templateUrl: './menu-bobine.component.html',
  styleUrls: ['./menu-bobine.component.scss']
})
export class MenuBobineComponent implements OnDestroy {

  subscrRowPlan: Subscription;
  rowTamburiSelectat = false;
  showTools = false;

  constructor(private tamburiService: TamburiService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private bobineService: BobineService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.subscrRowPlan = this.tamburiService.rowSelectedGridTamburi$
      .subscribe((data: PlanificareModel) => {
        this.rowTamburiSelectat = data ? true : false;

      })
  }

  onAddBobine() {
    if (!this.rowTamburiSelectat) {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un tambur", size: "w-50", time: 5000 })
      return;
    }
    this.bobineService.onOpenModal$.next(this.bobineService.getBobinaModel())
    this.router.navigate(["newBobina"], { relativeTo: this.activeRoute })
  }

  onDeleteBobine() {
    if (this.bobineService.rowSelectedGridBobine$.value != null) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed) => {
          if (confirmed) {
            this.bobineService.ondeleteBobina();
          }
        })
        .catch(() => { });
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-50", time: 5000 })
    }
  }

  onExportCSV() {
    this.bobineService.exportCSVGridBobine$.next(true);
  }

  onEditBobine() {
    if (this.bobineService.rowSelectedGridBobine$.value) {
      this.bobineService.onOpenModal$.next(this.bobineService.rowSelectedGridBobine$.value);
      this.router.navigate(["editBobina"], { relativeTo: this.activeRoute })
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un tambur", size: "w-50", time: 5000 })
    }
  }

  ngOnDestroy() {
    this.subscrRowPlan.unsubscribe();
  }
}
