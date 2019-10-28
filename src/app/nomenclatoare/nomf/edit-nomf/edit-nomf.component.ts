import { Component, OnInit, Input } from '@angular/core';
import { NomfService } from '../nomf.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { nomfModel } from '../nomf.model';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';

@Component({
  selector: 'app-edit-nomf',
  templateUrl: './edit-nomf.component.html',
  styleUrls: ['./edit-nomf.component.scss']
})
export class EditNomfComponent implements OnInit {
  @Input('configDialog') configDialog;
  @Input('editMode') editMode;

  formNomf: FormGroup;
  submit = false;
  modalReference: NgbModalRef;

  constructor(
    private advanceSearchService:AdvanceSearchService,
    private activeModal: NgbActiveModal,
    private nomfService: NomfService,
    private fb: FormBuilder
  ) {
    this.formNomf = this.fb.group({
      'COD': ["", Validators.required],
      'PAR': [{value: "", disabled: true}],
      'TIP': [""],
      'NUME': ["", Validators.required],
      'ORC': [""],
      'TARA': [""],
      'LOCALITATE': [""],
      'SECTOR': [""],
      'JUDET': [""],
      'STR': [""],
      'NR': [""],
      'BLOC': [""],
      'SCARA': [""],
      'AP': [""],
      'ETAJ': [""],
      'FAX': [""],
      'POSTAL': [""],
      'TEL': [""],
      'EMAIL': [""],
      'OBS': [""],
      'COD_OLD':[""]
    })
  }

  ngOnInit() {
  //  if(this.editMode) this.formNomf.controls["COD"].disable();
    this.nomfService.getRowEditare(this.configDialog["cod"]).then((rowData: nomfModel) => {
      for (let key in this.formNomf.controls) {
        if (rowData.hasOwnProperty(key)) {
          this.formNomf.controls[key].setValue(rowData[key]);
        }
        if (this.configDialog["fixedData"].hasOwnProperty(key)) {
          this.formNomf.controls[key].setValue(this.configDialog["fixedData"][key]);
        }
        if(rowData.hasOwnProperty("COD")) this.formNomf.controls["COD_OLD"].setValue(rowData["COD"])
      }
    })
  }

  onSubmit() {
    this.submit = true;
    if (this.formNomf.invalid) return;
    this.nomfService.saveRow$(this.formNomf.getRawValue(), this.editMode ? "modify" : "add").then(
      servMesg => {
        if (servMesg == "ok") {
          this.nomfService.loadGridNomf$.next(true);
          this.activeModal.close(this.formNomf.getRawValue())
          this.formNomf.reset();
        }
      }
    )
  }

  dismiss() {
    this.formNomf.reset();
    this.activeModal.close();
  }

  onCancel() {
    this.formNomf.reset();
    this.activeModal.close();
  }
  onAdvanceSearchPartener(valField){
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formNomf.controls['PAR'].setValue(dataRow["COD"]);
        }
      })
      .catch(err => { console.log(err) })
  }
  deletePar(){
    this.formNomf.controls['PAR'].setValue("");
  }
}