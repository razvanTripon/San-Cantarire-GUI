import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HelperService } from 'src/app/planificare/helper.service';
import { Subscription } from 'rxjs';
import { CantarireService } from '../../cantarire.service';
import { EditSetariCantarireService } from './edit-setari-cantarire/edit-setari-cantarire.service';

@Component({
  selector: 'app-menu-load-plan',
  templateUrl: './menu-load-plan.component.html',
  styles: [`
    .navbar { min-height:22px; border-radius:0} 
    .navbar .navbar-brand{ padding: 2px 8px;font-size: 14px;line-height: 14px; } 
    .navbar .navbar-nav > li > a { border-right:1px solid #ddd; padding-top: 2px; padding-bottom: 2px; line-height: 16px }`
  ]
})
export class MenuLoadPlanComponent implements OnInit, OnDestroy {
  data_plan = this.helper.getBootstrapDate(new Date());
  subsDisabled: Subscription;
  formPlan: FormGroup;
  disabledMenu = false;
  disabledButonIncarcaPlan = true;
  planuriOptions = [];


  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private cantarireService: CantarireService,
    private editSetariCantarireService:EditSetariCantarireService

  ) {
    this.formPlan = this.fb.group({
      'DATA_PLAN': [this.data_plan],
      'UID_PLAN': [null]
    })
  }
  ngOnInit() {
    this.onSelectDay();
    this.subsDisabled = this.cantarireService.cantarireAutomata$.subscribe(
      (disabled: boolean) => {
        if (disabled) {
          this.disableMenu();
        } else {
          this.enableMenu();
        }
      })
  }

  disableMenu() {
    this.formPlan.get("DATA_PLAN").disable();
    this.formPlan.get("UID_PLAN").disable();
    this.disabledButonIncarcaPlan = true;
    this.disabledMenu = true;
  }

  enableMenu() {
    this.formPlan.get("DATA_PLAN").enable();
    this.formPlan.get("UID_PLAN").enable();
    this.disabledButonIncarcaPlan = false;
    this.disabledMenu = false;
  }

  onSubmit() {
    this.cantarireService.selectedPlan$.next(this.formPlan.controls["UID_PLAN"].value)
  }
  onSelectDay() {
    this.formPlan.get("UID_PLAN").setValue(null);
    this.cantarireService.resetGrids();
    this.disabledButonIncarcaPlan = true;
    this.cantarireService.getPlanuriByDay(this.formPlan.controls['DATA_PLAN'].value)
      .then((data: any) => {
        this.planuriOptions = data;
      });
  }
  changePlan(uidPlan) {
    this.disabledButonIncarcaPlan = false;
    if (this.disabledMenu) this.disabledButonIncarcaPlan = true;
  }

  ngOnDestroy() {
    this.subsDisabled.unsubscribe();
  }
  setSettings(){
    this.editSetariCantarireService.openEditare()
  }
}
