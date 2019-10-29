import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ListareEtichetaService } from '../listare-eticheta.service';
import { HelperService } from 'src/app/planificare/helper.service';

@Component({
  selector: 'app-open-window',
  templateUrl: './open-window.component.html',
  styleUrls: ['./open-window.component.scss']
})
export class OpenWindowComponent {
  data_lst = this.helper.getBootstrapDate(new Date())
  formList: FormGroup;
  submit = false;
  labelProdus = ""
  constructor(
    private helper: HelperService,
    private listareEtichetaService: ListareEtichetaService,
    private router: Router,
    private advanceSearchService: AdvanceSearchService,
    private fb: FormBuilder,
    public typeAheadService: TypeAheadService,
    private activeModal: NgbActiveModal
  ) {
    this.formList = this.fb.group({
      'COD_PRODUS': ["",Validators.required],
      'NR_BOBINA': [0, Validators.required],
      'LATIME': [0],
      'LUNGIME': [0],
      'DIAM_INTERIOR': [0],
      'DIAM_EXTERIOR': [0],
      'GREUTATE': [0],
      'GRAMAJ': [0],
      'DATA_LST': [this.data_lst],
      'SORTIMENT':[""],
      'CPSA':[""]
    })
  }

  onSubmit() {
    this.submit=true;
    if (this.formList.invalid) return;
    const formObj=this.formList.getRawValue();
    formObj["COD_PRODUS"]= typeof formObj["COD_PRODUS"]=="object" ? formObj["COD_PRODUS"]["value"] : formObj["COD_PRODUS"];
    formObj["DATA_LST"]=this.helper.getJavascriptDate(formObj["DATA_LST"]);
    this.listareEtichetaService.viewCustomEticheta(formObj);
    this.onCancel();
  }

  onCancel() {
    this.activeModal.close();
    this.formList.reset();
    this.router.navigate(['home'])
  }

  dismiss() {
    this.onCancel();
  }

  searchClient = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomp");
  }

  getDataProdus(cod_p) {
    this.listareEtichetaService.getInfoCodp(cod_p)
      .then(data => {
        if (data) {
          if (data.hasOwnProperty("DIAM_EXTERIOR")) this.formList.controls['DIAM_EXTERIOR'].setValue(data["DIAM_EXTERIOR"]);
          if (data.hasOwnProperty("DIAM_INTERIOR")) this.formList.controls['DIAM_INTERIOR'].setValue(data["DIAM_INTERIOR"]);
          if (data.hasOwnProperty("LATIME")) this.formList.controls['LATIME'].setValue(data["LATIME"]);
          if (data.hasOwnProperty("GRAMAJ")) this.formList.controls['GRAMAJ'].setValue(data["GRAMAJ"]);
          if (data.hasOwnProperty("SORTIMENT")) this.formList.controls['SORTIMENT'].setValue(data["SORTIMENT"]);
          if (data.hasOwnProperty("CPSA")) this.formList.controls['CPSA'].setValue(data["CPSA"]);
        }
      })
      .catch(err => console.log(err))
    //console.log(cod_p)
  }

  onselectProdus(ev: NgbTypeaheadSelectItemEvent) {
    this.labelProdus = ev.item.label;
    this.getDataProdus(ev.item.value)
  }

  onAdvanceSearchProdus(valField) {
    this.advanceSearchService
      .searchModal('searchNomp', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formList.controls['COD_PRODUS'].setValue({ value: dataRow["CODP"], label: dataRow["DENUMIRE"] });
          this.labelProdus = dataRow["DENUMIRE"];
          this.getDataProdus(dataRow["CODP"])

        }
      })
      .catch(err => { console.log(err) })
  }
}
