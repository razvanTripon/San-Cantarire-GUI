import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { PlanService } from '../planuri.service';
import { DateFormat } from 'src/app/planificare/_models/planificare.model';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-menu-planificare',
  templateUrl: './menu-planificare.component.html',
  styleUrls: ['./menu-planificare.component.scss']
})
export class MenuPlanificareComponent implements OnInit {
  @ViewChild('statusDataFin', { static: true }) statusDataFin: ElementRef;
  formFiltrare: FormGroup;
  minDate: DateFormat;

  constructor(
    private planService: PlanService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.minDate = this.planService.data_ini;
    this.formFiltrare = new FormGroup({
      'data_ini': new FormControl(this.minDate, [Validators.required]),
      'data_fin': new FormControl({ value: '', disabled: true }, [])
    })
  }

  dateIniSelect() {
    this.minDate = this.formFiltrare.get('data_ini').value;
    this.toggleDataFin();
  }

  toggleDataFin() {
    let status = this.statusDataFin.nativeElement.checked
    let controlData_Fin = this.formFiltrare.get('data_fin');
    if (status) {
      controlData_Fin.enable();
      controlData_Fin.setValue(this.minDate)
    } else {
      controlData_Fin.disable();
      controlData_Fin.patchValue(null);
    }
  }

  onFilter() {
    this.planService.onFilterPlanificare(
      this.formFiltrare.get('data_ini').value,
      this.formFiltrare.get('data_fin').value
    )
  }

  onExportCSV() {
    this.planService.exportCSVGridPlanificare$.next(true);
  }

  onEdit() {
    this.planService.onOpenModal$.next(this.planService.rowSelectedGridPlanificare$.value);
    if (this.planService.rowSelectedGridPlanificare$.value != null) {
      this.router.navigate(["editPlan"], { relativeTo: this.activeRoute })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onAdd() {
    this.planService.onOpenModal$.next(this.planService.getPlanModel());
    this.router.navigate(["newPlan"], { relativeTo: this.activeRoute })
  }

  onDelete() {
    if (this.planService.rowSelectedGridPlanificare$.value != null) {
      this.confirmationDialogService
        .confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed:boolean) => {
          if(confirmed){
            this.planService.onDeleteRow();
          }
        })
        .catch(err=>{})
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }
}
