import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { CantarireService } from '../../cantarire.service';
import { Observable, Subscription } from 'rxjs';
import { EditNompService } from 'src/app/nomenclatoare/nomp/edit-nomp/edit-nomp.service';

@Component({
  selector: 'app-edit-comenzi',
  templateUrl: './edit-comenzi.component.html',
  styleUrls: ['./edit-comenzi.component.scss']
})
export class EditComenziComponent implements OnInit, OnDestroy {
  formComenzi: FormGroup;
  formReelGroup: FormGroup;
  formReel_1: FormGroup;
  formReel_2: FormGroup;
  formReel_3: FormGroup;
  formReel_4: FormGroup;
  subscriptioChangeSortiment: Subscription;
  subscriptioChangeClient_1: Subscription;
  subscriptioChangeClient_2: Subscription;
  subscriptioChangeClient_3: Subscription;
  subscriptioChangeClient_4: Subscription;

  subscriptioLatime1: Subscription;
  subscriptioLatime2: Subscription;
  subscriptioLatime3: Subscription;
  subscriptioLatime4: Subscription;

  labelSortimentMin = "";
  submit = false;
  labelClient_1 = "";
  labelClient_2 = "";
  labelClient_3 = "";
  labelClient_4 = "";
  labelSortiment = "";
  disableButtons = false;
  @Input('editMode') editMode;

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private fb: FormBuilder,
    public typeAheadService: TypeAheadService,
    private activeModal: NgbActiveModal,
    private cantarireService: CantarireService,
    private editNompService: EditNompService,
  ) {

    this.formReel_1 = this.fb.group({
      'REELWIDTH_1': [0],
      'REELSUBST_1': [0],
      'REELDEN_1': [""],
      'REELCLIENT_1': [{ value: "", label: "" }],
      'LABEL_CLIENT_1': [""]
    })
    this.formReel_1.setValidators(this.reelvalidator)
    this.formReel_2 = this.fb.group({
      'REELWIDTH_2': [0],
      'REELSUBST_2': [0],
      'REELDEN_2': [""],
      'REELCLIENT_2': [{ value: "", label: "" }],
      'LABEL_CLIENT_2': [""]
    })
    this.formReel_2.setValidators(this.reelvalidator)
    this.formReel_3 = this.fb.group({
      'REELWIDTH_3': [0],
      'REELSUBST_3': [0],
      'REELDEN_3': [""],
      'REELCLIENT_3': [{ value: "", label: "" }],
      'LABEL_CLIENT_3': [""]
    })
    this.formReel_3.setValidators(this.reelvalidator)

    this.formReel_4 = this.fb.group({
      'REELWIDTH_4': [0],
      'REELSUBST_4': [0],
      'REELDEN_4': [""],
      'REELCLIENT_4': [{ value: "", label: "" }],
      'LABEL_CLIENT_4': [""]
    })
    this.formReel_4.setValidators(this.reelvalidator)

    this.formReelGroup = this.fb.group({
      'formReel_1': this.formReel_1,
      'formReel_2': this.formReel_2,
      'formReel_3': this.formReel_3,
      'formReel_4': this.formReel_4
    })
    this.formReelGroup.setValidators(this.reelGroupValidato);

    this.formComenzi = this.fb.group({
      'UID': [""],
      'DATA': "",
      'COD_SORT': [{ value: "", label: "" }, this.typeAheadService.validatorTypeAhed],
      'DEN_SORT': [""],
      'COD_CEPI': [""],
      'formReelGroup': this.formReelGroup,
      'CANTITATE': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'DIAM_INT': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'DIAM_EXT': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
    })

  }

  ngOnInit() {
    this.subscriptioChangeSortiment = this.formComenzi.controls["COD_SORT"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") {
        this.labelSortiment = "";
      }
    });
    this.subscriptioLatime1 = this.formReel_1.controls["REELWIDTH_1"].valueChanges.subscribe(val => {
      if (this.formReel_1.controls["REELDEN_1"].value == "") {
        this.formReel_1.controls["REELDEN_1"].setValue(this.labelSortimentMin)
      }
    })
    this.subscriptioLatime2 = this.formReel_2.controls["REELWIDTH_2"].valueChanges.subscribe(val => {
      if (this.formReel_2.controls["REELDEN_2"].value == "") {
        this.formReel_2.controls["REELDEN_2"].setValue(this.labelSortimentMin)
      }
    })
    this.subscriptioLatime3 = this.formReel_3.controls["REELWIDTH_3"].valueChanges.subscribe(val => {
      if (this.formReel_3.controls["REELDEN_3"].value == "") {
        this.formReel_3.controls["REELDEN_3"].setValue(this.labelSortimentMin)
      }
    })
    this.subscriptioLatime4 = this.formReel_4.controls["REELWIDTH_4"].valueChanges.subscribe(val => {
      if (this.formReel_4.controls["REELDEN_4"].value == "") {
        this.formReel_4.controls["REELDEN_4"].setValue(this.labelSortimentMin)
      }
    })

    this.subscriptioChangeClient_1 = this.formReel_1.controls["REELCLIENT_1"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.labelClient_1 = "";
    })
    this.subscriptioChangeClient_2 = this.formReel_2.controls["REELCLIENT_2"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.labelClient_2 = "";
    })
    this.subscriptioChangeClient_3 = this.formReel_3.controls["REELCLIENT_3"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.labelClient_3 = "";
    })
    this.subscriptioChangeClient_4 = this.formReel_4.controls["REELCLIENT_4"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.labelClient_4 = "";
    })

    if (this.editMode == "add") {
      this.formComenzi.setValue(this.cantarireService.adaugareComanda())
    } else {
      this.disableButtons = true;
      this.cantarireService.editComanda().then(comData => {
        this.formComenzi.setValue(comData);
        this.labelSortiment = comData["DEN_SORT"]
        this.labelSortimentMin = comData["DEN_SORT"];
        this.labelClient_1 = comData["formReelGroup"]["formReel_1"]["LABEL_CLIENT_1"];
        this.labelClient_2 = comData["formReelGroup"]["formReel_2"]["LABEL_CLIENT_2"];
        this.labelClient_3 = comData["formReelGroup"]["formReel_3"]["LABEL_CLIENT_3"];
        this.labelClient_4 = comData["formReelGroup"]["formReel_4"]["LABEL_CLIENT_4"];
        this.disableElem();
      })
    }
  }

  disableElem() {
    this.formReel_1.controls["REELWIDTH_1"].disable();
    this.formReel_1.controls["REELSUBST_1"].disable();
    this.formReel_2.controls["REELWIDTH_2"].disable();
    this.formReel_2.controls["REELSUBST_2"].disable();
    this.formReel_3.controls["REELWIDTH_3"].disable();
    this.formReel_3.controls["REELSUBST_3"].disable();
    this.formReel_4.controls["REELWIDTH_4"].disable();
    this.formReel_4.controls["REELSUBST_4"].disable();
    this.formComenzi.controls["COD_SORT"].disable();
    this.formComenzi.controls["CANTITATE"].disable();
    this.formComenzi.controls["DIAM_INT"].disable();
    this.formComenzi.controls["DIAM_EXT"].disable();
  }

  getNGvalue(elem) {
    return elem && typeof elem == "object" ? elem.value : elem
  }

  onSubmit() {
    this.submit = true;
    if (this.formComenzi.invalid) return;
    const rawVals = this.formComenzi.getRawValue()
    let obj = {
      UID: rawVals["UID"],
      DATA: rawVals["DATA"],
      COD_SORT: this.getNGvalue(rawVals["COD_SORT"]),
      DEN_SORT: rawVals["DEN_SORT"],
      COD_CEPI: "",
      REELWIDTH_1: rawVals["formReelGroup"]["formReel_1"]["REELWIDTH_1"],
      REELSUBST_1: rawVals["formReelGroup"]["formReel_1"]["REELSUBST_1"],
      REELDEN_1: rawVals["formReelGroup"]["formReel_1"]["REELDEN_1"],
      REELCLIENT_1: this.getNGvalue(rawVals["formReelGroup"]["formReel_1"]["REELCLIENT_1"]),
      REELWIDTH_2: rawVals["formReelGroup"]["formReel_2"]["REELWIDTH_2"],
      REELSUBST_2: rawVals["formReelGroup"]["formReel_2"]["REELSUBST_2"],
      REELDEN_2: rawVals["formReelGroup"]["formReel_2"]["REELDEN_2"],
      REELCLIENT_2: this.getNGvalue(rawVals["formReelGroup"]["formReel_2"]["REELCLIENT_2"]),
      REELWIDTH_3: rawVals["formReelGroup"]["formReel_3"]["REELWIDTH_3"],
      REELSUBST_3: rawVals["formReelGroup"]["formReel_3"]["REELSUBST_3"],
      REELDEN_3: rawVals["formReelGroup"]["formReel_3"]["REELDEN_3"],
      REELCLIENT_3: this.getNGvalue(rawVals["formReelGroup"]["formReel_3"]["REELCLIENT_3"]),
      REELWIDTH_4: rawVals["formReelGroup"]["formReel_4"]["REELWIDTH_4"],
      REELSUBST_4: rawVals["formReelGroup"]["formReel_4"]["REELSUBST_4"],
      REELDEN_4: rawVals["formReelGroup"]["formReel_4"]["REELDEN_4"],
      REELCLIENT_4: this.getNGvalue(rawVals["formReelGroup"]["formReel_4"]["REELCLIENT_4"]),
      CANTITATE: rawVals["CANTITATE"],
      DIAM_INT: rawVals["DIAM_INT"],
      DIAM_EXT: rawVals["DIAM_EXT"]
    }
    this.cantarireService.saveComanda(obj, this.editMode).then(
      dataServer => {
        this.activeModal.close();
      }
    )
  }

  onCancel(type = "cancel") {
    this.activeModal.close();
    this.formComenzi.reset();
  }

  dismiss() {
    this.onCancel("dismiss");
    this.formComenzi.reset();
  }

  searchClient = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomf");
  }

  onselectClient(ev: NgbTypeaheadSelectItemEvent, formcontrolName) {
    if (formcontrolName == "REELCLIENT_1") this.labelClient_1 = ev.item.label;
    if (formcontrolName == "REELCLIENT_2") this.labelClient_2 = ev.item.label;
    if (formcontrolName == "REELCLIENT_3") this.labelClient_3 = ev.item.label;
    if (formcontrolName == "REELCLIENT_4") this.labelClient_4 = ev.item.label;
  }

  onAdvanceSearchClient(valField, formcontrolName) {
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          if (formcontrolName == "REELCLIENT_1") {
            this.formReel_1.controls['REELCLIENT_1'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.labelClient_1 = dataRow["NUME"];
          }
          if (formcontrolName == "REELCLIENT_2") {
            this.formReel_2.controls['REELCLIENT_2'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.labelClient_2 = dataRow["NUME"];
          }
          if (formcontrolName == "REELCLIENT_3") {
            this.formReel_3.controls['REELCLIENT_3'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.labelClient_3 = dataRow["NUME"];
          }
          if (formcontrolName == "REELCLIENT_4") {
            this.formReel_4.controls['REELCLIENT_4'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.labelClient_4 = dataRow["NUME"];
          }
        }
      })
      .catch(err => { console.log(err) })
  }

  searchSortiment = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nompOnlySortiment");
  }

  setLabelSortiment(label: string) {
    this.formReel_1.controls["REELDEN_1"].setValue(label);
    this.formReel_2.controls["REELDEN_2"].setValue(label);
    this.formReel_3.controls["REELDEN_3"].setValue(label);
    this.formReel_4.controls["REELDEN_4"].setValue(label);
  }

  onselectSortiment(ev: NgbTypeaheadSelectItemEvent) {
    if (ev.item.denumire) this.labelSortimentMin = ev.item.denumire
    this.labelSortiment = ev.item.label;
  }

  onAdvanceSearchSortiment(valField) {
    this.advanceSearchService
      .searchModal('searchOnlySortiment', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          //  console.log(dataRow)
          this.formComenzi.controls['COD_SORT'].setValue({ value: dataRow["CODP"], label: dataRow["DENUMIRE"] });
          this.labelSortiment = dataRow["CODP"] + " - " + dataRow["DENUMIRE"] + " (Cod CEPI " + dataRow["CPSA"] + ")";
          this.labelSortimentMin = dataRow["DENUMIRE"];
        }
      })
      .catch(err => { })
  }

  onAddSortiment() {
    this.editNompService.openEditare()
      .then(data => {
        if (data) {
          this.formComenzi.controls['COD_SORT'].setValue({ value: data["CODP"], label: data["DENUMIRE"] });
          this.labelSortiment = data["DENUMIRE"];
          this.labelSortimentMin = data["DENUMIRE"];
        }
      })
      .catch(err => { })
  }

  verifyValid(controlerName) {
    return this.formComenzi.get(controlerName).invalid && this.submit
  }

  reelvalidator(form: FormGroup): { [s: string]: boolean } {
    let REELWIDTH = 0;
    let REELSUBST = 0;
    let REELCLIENT;
    Object.keys(form.controls).forEach(key => {
      if (key.startsWith("REELWIDTH")) REELWIDTH = form.controls[key].value;
      if (key.startsWith("REELSUBST")) REELSUBST = form.controls[key].value;
      if (key.startsWith("REELCLIENT")) REELCLIENT = form.controls[key].value;
    });
    REELWIDTH = REELWIDTH ? REELWIDTH : 0;
    REELSUBST = REELSUBST ? REELSUBST : 0;
    REELCLIENT = typeof REELCLIENT == "undefined" ? "" : REELCLIENT;
    REELCLIENT = typeof REELCLIENT == "object" && REELCLIENT ? REELCLIENT["value"] : REELCLIENT;
    if (REELWIDTH == 0 && REELSUBST == 0 && REELCLIENT == "") return null;
    if (REELWIDTH != 0 && REELSUBST != 0) return null;
    return { err: true };

  }

  reelGroupValidato(form: FormGroup): { [s: string]: boolean } {
    let REELWIDTH_1 = form["controls"]["formReel_1"]["controls"]["REELWIDTH_1"].value;
    let REELWIDTH_2 = form["controls"]["formReel_2"]["controls"]["REELWIDTH_2"].value;
    let REELWIDTH_3 = form["controls"]["formReel_3"]["controls"]["REELWIDTH_3"].value;
    REELWIDTH_1 = REELWIDTH_1 ? REELWIDTH_1 : 0;
    REELWIDTH_2 = REELWIDTH_2 ? REELWIDTH_2 : 0;
    REELWIDTH_3 = REELWIDTH_3 ? REELWIDTH_3 : 0;
    if (REELWIDTH_1 != 0 || REELWIDTH_2 != 0 || REELWIDTH_3 != 0) {
      return null;
    }
    return { err: true };
  }

  updateText(controlerName) {
    if (controlerName == "REELDEN_1") this.formReel_1.controls["REELDEN_1"].setValue(this.labelSortimentMin);
    if (controlerName == "REELDEN_2") this.formReel_2.controls["REELDEN_2"].setValue(this.labelSortimentMin);
    if (controlerName == "REELDEN_3") this.formReel_3.controls["REELDEN_3"].setValue(this.labelSortimentMin);
    if (controlerName == "REELDEN_4") this.formReel_4.controls["REELDEN_4"].setValue(this.labelSortimentMin);

  }

  ngOnDestroy() {
    this.subscriptioChangeClient_1.unsubscribe();
    this.subscriptioChangeClient_2.unsubscribe();
    this.subscriptioChangeClient_3.unsubscribe();
    this.subscriptioChangeClient_4.unsubscribe();
    this.subscriptioChangeSortiment.unsubscribe();

    this.subscriptioLatime1.unsubscribe();
    this.subscriptioLatime2.unsubscribe();
    this.subscriptioLatime3.unsubscribe();
    this.subscriptioLatime4.unsubscribe();

  }
}
