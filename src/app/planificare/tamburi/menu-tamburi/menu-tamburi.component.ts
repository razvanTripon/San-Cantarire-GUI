import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanService } from '../../planuri/planuri.service';
import { Subscription } from 'rxjs';
import { PlanificareModel } from '../../_models/planificare.model';
import { TamburiService } from '../tamburi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-menu-tamburi',
  templateUrl: './menu-tamburi.component.html',
  styleUrls: ['./menu-tamburi.component.scss']
})
export class MenuTamburiComponent implements OnInit, OnDestroy {
  subscrRowPlan: Subscription;
  rowPlanificareSelectat = false;
  showTools = false;

  constructor(private planService: PlanService,
    private tamburiService: TamburiService,
    private router: Router,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.subscrRowPlan = this.planService.rowSelectedGridPlanificare$
      .subscribe((data: PlanificareModel) => {
        this.rowPlanificareSelectat = data ? true : false;
      })
  }
  ngOnInit() {
  }
  onAddTamburi() {
    if (!this.rowPlanificareSelectat) {
      this.alertService.emitAlert({ message: "Va rugam selectati un plan", type: "danger", size: "w-50" })
      return;
    }
    this.tamburiService.onOpenModal$.next(this.tamburiService.getTamburModel())
    this.router.navigate(["newTambur"], { relativeTo: this.activeRoute })
  }

  onDeleteTamburi() {
    if (this.tamburiService.rowSelectedGridTamburi$.value) {
      this.confirmationDialogService
        .confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.tamburiService.ondeleteTambur();
          }
        })
        .catch(err => { })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onExportCSV() {
    this.tamburiService.exportCSVGridPlanificare$.next(true);
  }
  ngOnDestroy() {
    this.subscrRowPlan.unsubscribe();
  }
  onEditTamburi() {
    if (this.tamburiService.rowSelectedGridTamburi$.value) {
      this.tamburiService.onOpenModal$.next(this.tamburiService.rowSelectedGridTamburi$.value);
      this.router.navigate(["editTambur"], { relativeTo: this.activeRoute })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger", size: "w-50" })
    }
  }
}
