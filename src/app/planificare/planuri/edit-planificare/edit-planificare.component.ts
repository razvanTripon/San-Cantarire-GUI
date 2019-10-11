import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanificareModel } from '../../_models/planificare.model';
import { PlanService } from '../planuri.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-planificare',
  templateUrl: './edit-planificare.component.html',
  styleUrls: ['./edit-planificare.component.scss']

})
export class EditPlanificareComponent implements OnInit, OnDestroy {
  formOperare: FormGroup;
  @ViewChild('contentModal', { static: true }) contentModal;
  editMode: boolean;
  subscription: Subscription;
  subscrSaveData: Subscription;
  submit = false;

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private planService: PlanService) {
    this.editMode = this.activeRoute.snapshot.routeConfig.path === "editPlan" ? true : false
    // console.log(this.activeRoute.snapshot.routeConfig.path)
  }
  ngOnInit(): void {
    this.subscription = this.planService.onOpenModal$.subscribe(
      (data: PlanificareModel) => {
        this.formOperare = this.fb.group({
          'UID': [data.UID],
          'PARENT': [data.PARENT],
          'DATA_PLAN': [data.DATA_PLAN, Validators.required],
          'NR_PLAN': [data.NR_PLAN, Validators.required],
          'DENUMIRE': [data.DENUMIRE, Validators.required],
          'POZITIE_TAMBUR': [data.POZITIE_TAMBUR],
          'COD_SORTIMENT': [data.COD_SORTIMENT],
          'POZITIE_BOBINA': [data.POZITIE_BOBINA],
          'COD_PRODUS': [data.COD_PRODUS],
          'CLIENT': [data.CLIENT],
          'NR_COMANDA': [data.NR_COMANDA],
          'CANT_PLANIFICAT': [data.CANT_PLANIFICAT],
          'TIP': [data.TIP]
        });
        setTimeout(() => {
          this.open();
        }, 200)

      }
    )
  }

  open() {
    this.submit = false;
    this.modalService.open(this.contentModal, { size: 'lg' }).result
      .then((result) => { this.router.navigate(["../"], { relativeTo: this.activeRoute }) },
        (reason) => { this.router.navigate(["../"], { relativeTo: this.activeRoute }) })
  }
  onCancel() {
    this.formOperare.reset();
    this.modalService.dismissAll();
  }
  onSubmit() {
    this.submit = true;
    if (this.formOperare.invalid) return;
    this.planService.saveDataPlanificare(this.formOperare.value, this.editMode)
      .then(
        dataPlan => {
          this.planService.reloadGridPlanificare();
          this.modalService.dismissAll();
        })
      .catch(onError => {
        alert(onError)
      })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}