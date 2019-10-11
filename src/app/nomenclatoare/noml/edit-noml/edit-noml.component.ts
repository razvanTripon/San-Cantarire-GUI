import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { NomlService } from '../noml.service';
import { nomlModel } from '../noml.model';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { Observable } from 'rxjs';
import { TypeAheadService } from 'src/app/_services/typeahead.service';

@Component({
  selector: 'app-edit-noml',
  templateUrl: './edit-noml.component.html',
  styleUrls: ['./edit-noml.component.scss']
})
export class EditNomlComponent implements OnInit {
  @Input('configDialog') configDialog;
  @Input('editMode') editMode;

  formNoml: FormGroup;
  submit = false;
  labelPartener = "";
  labelPar = ""

  constructor(
    public typeAheadService: TypeAheadService,
    private advanceSearchService: AdvanceSearchService,
    private activeModal: NgbActiveModal,
    private nomlService: NomlService,
    private fb: FormBuilder
  ) {
    this.formNoml = this.fb.group({
      'COD': ["", Validators.required],
      'PAR': [{ value: "", disabled: true }],
      'NUME': ["", Validators.required],
      'DATA_LAN': ["", Validators.required],
      'DATA_INCH': ["", Validators.required],
      'PARTENER': [{ value: "", label: "" }, this.partenervalidator],
      'OBS': [""],
    })
  }

  ngOnInit() {
    if (this.editMode) this.formNoml.controls["COD"].disable();
    this.nomlService.getRowEditare(this.configDialog["cod"]).then((rowData: nomlModel) => {
      for (let key in this.formNoml.controls) {
        if (this.configDialog["fixedData"].hasOwnProperty(key)) {
          this.formNoml.controls[key].setValue(this.configDialog["fixedData"][key]);
          if (key == "PARTENER") {
            this.labelPartener = this.configDialog["fixedData"]["PARTENER"].label;
          }
        } else {
          if (rowData.hasOwnProperty(key)) {
            if (key == "PARTENER") {
              this.formNoml.controls["PARTENER"].setValue({ value: rowData["PARTENER"], label: rowData["DENUMIRE_PARTENER"] })
              this.labelPartener = rowData["DENUMIRE_PARTENER"];
            } else {
              this.formNoml.controls[key].setValue(rowData[key]);
            }
          }
        }

        // this.formNoml.controls["PARTENER"].setValue({ value: rowData["PARTENER"], label: rowData["DENUMIRE_PARTENER"] })
        // console.log("aici1")

        // this.labelPartener = rowData["DENUMIRE_PARTENER"];
        // if (this.configDialog["fixedData"].hasOwnProperty(key)) {
        //   if (key == "PARTENER") {
        //     console.log("aici2")
        //     this.formNoml.controls["PARTENER"].setValue({ value: "dd", label: "ddd" })

        //   } else {
        //     this.formNoml.controls[key].setValue(this.configDialog["fixedData"][key]);
        //   }
        // }
      }
    })
  }

  onSubmit() {
    this.submit = true;
    if (this.formNoml.invalid) return;
    this.nomlService.saveRow$(this.formNoml.getRawValue(), this.editMode ? "modify" : "add").then(
      servMesg => {
        if (servMesg == "ok") {
          this.nomlService.loadGridNoml$.next(true);
          this.activeModal.close(this.formNoml.getRawValue())
          this.formNoml.reset();
        }
      })
  }

  dismiss() {
    this.formNoml.reset();
    this.activeModal.dismiss();
  }

  onCancel() {
    this.formNoml.reset();
    this.activeModal.close();
  }

  searchParinte(valField) {
    this.advanceSearchService
      .searchModal('searchNoml', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formNoml.controls['PAR'].setValue(dataRow["COD"]);
        }
      })
      .catch(err => { console.log(err) })
  }

  deleteParinte() {
    this.formNoml.controls['PAR'].setValue("");
  }
  searchClient = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomf");
  }
  onselectClient(ev: NgbTypeaheadSelectItemEvent) {
    this.labelPartener = ev.item.label;
  }
  onAdvanceSearchClient(valField) {
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formNoml.controls['PARTENER'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] });
          this.labelPartener = dataRow["NUME"];
        }
      })
      .catch(err => { console.log(err) })
  }

  partenervalidator(control: FormControl): { [s: string]: boolean } {
    const numevarVal = control.value;
    let rez = "invalid";
    if (numevarVal) {
      if (typeof numevarVal == "object") {
        if (numevarVal["value"] && numevarVal["value"] != "") {
          rez = "valid"
        }
      } else {
        if (numevarVal != "") rez = "valid"
      }
    }
    return rez == "invalid" ? { invalid: true } : null
  }
}
