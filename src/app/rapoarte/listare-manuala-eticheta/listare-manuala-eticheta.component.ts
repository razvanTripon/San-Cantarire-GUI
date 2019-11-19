import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from 'src/app/_services/helper.service';
import { ListareManualaEtichetaService } from './listare-manuala-eticheta.service';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listare-manuala-eticheta',
  templateUrl: './listare-manuala-eticheta.component.html'
})
export class ListareManualaEtichetaComponent {

  data_lst = this.helper.getBootstrapDate(new Date())
  formList: FormGroup;
  submit = false;
  labelProdus = ""
  constructor(
    private helper: HelperService,
    private listareEtichetaService: ListareManualaEtichetaService,
    private advanceSearchService: AdvanceSearchService,
    private fb: FormBuilder,
    public typeAheadService: TypeAheadService,
    private activeModal: NgbActiveModal
  ) {
    this.formList = this.fb.group({
      'DEN_SORT': ["", Validators.required],
      'NR_BOBINA': ["", Validators.required],
      'LATIME': [0],
      'LUNGIME': [0],
      'DIAM_INTERIOR': [0],
      'DIAM_EXTERIOR': [0],
      'GREUTATE': [0],
      'GRAMAJ': [0],
      'DATA_LST': [this.data_lst],
      'SORTIMENT': [""],
      'COD_CEPI': [""]
    })
  }

  onSubmit() {
    this.submit = true;
    if (this.formList.invalid) return;
    const formObj = this.formList.getRawValue();
    //formObj["COD_PRODUS"]= typeof formObj["COD_PRODUS"]=="object" ? formObj["COD_PRODUS"]["value"] : formObj["COD_PRODUS"];
    formObj["DATA_LST"] = this.helper.getJavascriptDate(formObj["DATA_LST"]);
    this.listareEtichetaService.viewCustomEticheta(formObj);
    this.onCancel();
  }

  onCancel() {
    this.activeModal.close();
    this.formList.reset();
  }

  dismiss() {
    this.onCancel();
  }

  // getDataProdus(cod_p) {
  //   this.listareEtichetaService.getInfoCodp(cod_p)
  //     .then(data => {
  //       if (data) {
  //         if (data.hasOwnProperty("DIAM_EXTERIOR")) this.formList.controls['DIAM_EXTERIOR'].setValue(data["DIAM_EXTERIOR"]);
  //         if (data.hasOwnProperty("DIAM_INTERIOR")) this.formList.controls['DIAM_INTERIOR'].setValue(data["DIAM_INTERIOR"]);
  //         if (data.hasOwnProperty("LATIME")) this.formList.controls['LATIME'].setValue(data["LATIME"]);
  //         if (data.hasOwnProperty("GRAMAJ")) this.formList.controls['GRAMAJ'].setValue(data["GRAMAJ"]);
  //         if (data.hasOwnProperty("SORTIMENT")) this.formList.controls['SORTIMENT'].setValue(data["SORTIMENT"]);
  //         if (data.hasOwnProperty("COD_CEPI")) this.formList.controls['COD_CEPI'].setValue(data["COD_CEPI"]);
  //       }
  //     })
  //     .catch(err => console.log(err))
  //   //console.log(cod_p)
  // }

  onAdvanceSearchBobina(valField) {
    this.advanceSearchService
      .searchModal('searchBobina', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          const dataLst=new Date(dataRow["DATA_LST"]) 
         // console.log(dataRow)
          if (dataRow.hasOwnProperty("DEN_SORT")) this.formList.controls['DEN_SORT'].setValue(dataRow["DEN_SORT"]);
          if (dataRow.hasOwnProperty("NR_BOBINA")) this.formList.controls['NR_BOBINA'].setValue(dataRow["NR_BOBINA"]);
          if (dataRow.hasOwnProperty("LATIME")) this.formList.controls['LATIME'].setValue(dataRow["LATIME"]);
          if (dataRow.hasOwnProperty("LUNGIME")) this.formList.controls['LUNGIME'].setValue(dataRow["LUNGIME"]);
          if (dataRow.hasOwnProperty("DIAM_INTERIOR")) this.formList.controls['DIAM_INTERIOR'].setValue(dataRow["DIAM_INTERIOR"]);
          if (dataRow.hasOwnProperty("DIAM_EXTERIOR")) this.formList.controls['DIAM_EXTERIOR'].setValue(dataRow["DIAM_EXTERIOR"]);
          if (dataRow.hasOwnProperty("GREUTATE")) this.formList.controls['GREUTATE'].setValue(dataRow["GREUTATE"]);
          if (dataRow.hasOwnProperty("GRAMAJ")) this.formList.controls['GRAMAJ'].setValue(dataRow["GRAMAJ"]);
          if (dataRow.hasOwnProperty("COD_CEPI")) this.formList.controls['COD_CEPI'].setValue(dataRow["COD_CEPI"]);
          if (dataRow.hasOwnProperty("DATA_LST")) this.formList.controls['DATA_LST'].setValue(this.helper.getBootstrapDate(dataLst));
        }
      })
      .catch(err => { console.log(err) })
  }
}
