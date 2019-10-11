import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nompModel } from '../nomp.model';
import { NompService } from '../nomp-service';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';

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
    private advanceSearchService: AdvanceSearchService,
    private activeModal: NgbActiveModal,
    private nompService: NompService,
    private fb: FormBuilder,

  ) {
    this.formNomp = this.fb.group({
      'CODP': ["", Validators.required],
      'TIPMAT': [""],
      'PAR': [{ value: "", disabled: true }],
      'DENUMIRE': ["", Validators.required],
      'UM': [""],
      'GRAMAJ': [0],
      'LATIME': [0],
      'DIAM_INTERIOR': [0],
      'DIAM_EXTERIOR': [0],
      'OBS': [],
      'CPSA':[]
    })
  }

  ngOnInit() {
    if(this.editMode) this.formNomp.controls["CODP"].disable();
    this.nompService.getRowEditare(this.configDialog["codp"]).then((rowData: nompModel) => {
      for (let key in this.formNomp.controls) {
        if (rowData.hasOwnProperty(key)) {
          this.formNomp.controls[key].setValue(rowData[key]);
        }
        if (this.configDialog["fixedData"].hasOwnProperty(key)) {
          this.formNomp.controls[key].setValue(this.configDialog["fixedData"][key]);
        }
      }
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
    this.activeModal.dismiss();
  }

  onCancel() {
    this.formNomp.reset();
    this.activeModal.close();
  }

  searchSortiment(valField) {
    this.advanceSearchService
      .searchModal('searchNompSortiment', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formNomp.controls['PAR'].setValue(dataRow["CODP"]);
        }
      })
      .catch(err => { console.log(err) })
  }

  deleteSortiment() {
    this.formNomp.controls['PAR'].setValue("");
  }
}
