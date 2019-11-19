import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nompModel } from '../nomp.model';
import { NompService } from '../nomp-service';

@Component({
  selector: 'app-edit-nomp',
  templateUrl: './edit-nomp.component.html',
  styleUrls: ['./edit-nomp.component.scss']
})
export class EditNompComponent implements OnInit {

  @Input('configDialog') configDialog;
  @Input('editMode') editMode;
  formNomp: FormGroup;
  submit = false;

  constructor(
    private activeModal: NgbActiveModal,
    private nompService: NompService,
    private fb: FormBuilder,

  ) {
    this.formNomp = this.fb.group({
      'CODP': ["", Validators.required],
      'TIPMAT': [""],
      'PAR': ["SORT"],
      'DENUMIRE': ["", Validators.required],
      'UM': [""],
      'PAD':[0],
      'MONEDA':[""],
      'PRET':[""],
      'TAXE':[""],
      'CODAUX':[""],
      'PRETDEVIZ':[0],
      'PRETRECOM':[0],
      'GRAMAJ': [0],
      'LATIME': [0],
      'DIAM_INTERIOR': [0],
      'DIAM_EXTERIOR': [0],
      'OBS': [""],
      'CPSA':["",this.validatorNumber],
      'CONT':[""],
      'CONC_ALCOOL':[0],
      'GRAMAJ_BRUT':[0],
      'CODURI':[""],
      'RETETAR':[""],
      'MARCA':[""],
      'CODP_OLD':[""]
    })
  }

  ngOnInit() {
    this.nompService.getRowEditare(this.configDialog["codp"]).then((rowData: nompModel) => {
      for (let key in this.formNomp.controls) {
        if (rowData.hasOwnProperty(key) && rowData[key]!=null) {
          this.formNomp.controls[key].setValue(rowData[key]);
        }
        if (this.configDialog["fixedData"].hasOwnProperty(key)) {
          this.formNomp.controls[key].setValue(this.configDialog["fixedData"][key]);
        }
      }
      if(rowData.hasOwnProperty("CODP")) this.formNomp.controls["CODP_OLD"].setValue(rowData["CODP"])
    })
  }

  onSubmit() {
    this.submit = true;
    if (this.formNomp.invalid) return;
    this.nompService.saveRow$(this.formNomp.getRawValue(), this.editMode ? "modify" : "add").then(
      servMesg => {
        if (servMesg == "ok") {
          this.nompService.loadGridNomp$.next(true);
          this.activeModal.close(this.formNomp.getRawValue())
          this.formNomp.reset();
        }
      }
    )
  }

  dismiss() {
    this.formNomp.reset();
    this.activeModal.close();
  }

  onCancel() {
    this.formNomp.reset();
    this.activeModal.close();
  }
  
  validatorNumber(controler: FormControl): { [s: string]: boolean } {
    if (controler.value) {
      if (controler.value != 0 && controler.value > 0) return null;
    }
    return { err: true }
  }
}
