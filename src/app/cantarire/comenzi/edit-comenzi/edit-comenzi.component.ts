import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  reel1Active = false;
  reel2Active = false;
  reel3Active = false;
  reel4Active = false;

  formComenzi: FormGroup;
  formReelGroup: FormGroup;
  formReel_1: FormGroup;
  formReel_2: FormGroup;
  formReel_3: FormGroup;
  formReel_4: FormGroup;

  subscriptioChangeClient_1: Subscription;
  subscriptioChangeClient_2: Subscription;
  subscriptioChangeClient_3: Subscription;
  subscriptioChangeClient_4: Subscription;

  subscriptioChangeSort_1: Subscription;
  subscriptioChangeSort_2: Subscription;
  subscriptioChangeSort_3: Subscription;
  subscriptioChangeSort_4: Subscription;


  submit = false;
  disableButtons = false;

  disableClient1 = false;
  disableClient2 = false;
  disableClient3 = false;
  disableClient4 = false;

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
      'REELSORT_1': [{ value: "", label: "" }],
      'REELCEPI_1': [{ value: "", disabled: true }],
      'REELWIDTH_1': [0],
      'REELSUBST_1': [0],
      'REELDEN_1': [{ value: "", disabled: true }],
      'REELCLIENT_1': [{ value: "", label: "" }],
      'LABEL_CLIENT_1': [{ value: "", disabled: true }]
    })
    this.formReel_1.setValidators(this.reelvalidator)
    this.formReel_2 = this.fb.group({
      'REELSORT_2': [{ value: "", label: "" }],
      'REELCEPI_2': [{ value: "", disabled: true }],
      'REELWIDTH_2': [0],
      'REELSUBST_2': [0],
      'REELDEN_2': [{ value: "", disabled: true }],
      'REELCLIENT_2': [{ value: "", label: "" }],
      'LABEL_CLIENT_2': [{ value: "", disabled: true }]
    })
    this.formReel_2.setValidators(this.reelvalidator)
    this.formReel_3 = this.fb.group({
      'REELSORT_3': [{ value: "", label: "" }],
      'REELCEPI_3': [{ value: "", disabled: true }],
      'REELWIDTH_3': [0],
      'REELSUBST_3': [0],
      'REELDEN_3': [{ value: "", disabled: true }],
      'REELCLIENT_3': [{ value: "", label: "" }],
      'LABEL_CLIENT_3': [{ value: "", disabled: true }]
    })
    this.formReel_3.setValidators(this.reelvalidator)

    this.formReel_4 = this.fb.group({
      'REELSORT_4': [{ value: "", label: "" }],
      'REELCEPI_4': [{ value: "", disabled: true }],
      'REELWIDTH_4': [0],
      'REELSUBST_4': [0],
      'REELDEN_4': [{ value: "", disabled: true }],
      'REELCLIENT_4': [{ value: "", label: "" }],
      'LABEL_CLIENT_4': [{ value: "", disabled: true }]
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
      'formReelGroup': this.formReelGroup,
      'CANTITATE': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'DIAM_INT': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'DIAM_EXT': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
    })

  }

  onClickRow(idRow) {
    this.reel1Active = false;
    this.reel2Active = false;
    this.reel3Active = false;
    this.reel4Active = false;
    if (idRow == "1") this.reel1Active = true;
    if (idRow == "2") this.reel2Active = true;
    if (idRow == "3") this.reel3Active = true;
    if (idRow == "4") this.reel4Active = true;
  }

  ngOnInit() {
    this.subscriptioChangeSort_1 = this.formReel_1.controls["REELSORT_1"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") {
        this.formReel_1.controls["REELCEPI_1"].setValue("");
        this.formReel_1.controls["REELDEN_1"].setValue("");
      }
    });
    this.subscriptioChangeSort_2 = this.formReel_2.controls["REELSORT_2"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") {
        this.formReel_2.controls["REELCEPI_2"].setValue("");
        this.formReel_2.controls["REELDEN_2"].setValue("");
      }
    });
    this.subscriptioChangeSort_3 = this.formReel_3.controls["REELSORT_3"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") {
        this.formReel_3.controls["REELCEPI_3"].setValue("");
        this.formReel_3.controls["REELDEN_3"].setValue("");
      }
    });
    this.subscriptioChangeSort_4 = this.formReel_4.controls["REELSORT_4"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") {
        this.formReel_4.controls["REELCEPI_4"].setValue("");
        this.formReel_4.controls["REELDEN_4"].setValue("");
      }
    });
    this.subscriptioChangeClient_1 = this.formReel_1.controls["REELCLIENT_1"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.formReel_1.controls["LABEL_CLIENT_1"].setValue("");
    })
    this.subscriptioChangeClient_2 = this.formReel_2.controls["REELCLIENT_2"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.formReel_2.controls["LABEL_CLIENT_2"].setValue("");
    })
    this.subscriptioChangeClient_3 = this.formReel_3.controls["REELCLIENT_3"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.formReel_3.controls["LABEL_CLIENT_3"].setValue("");
    })
    this.subscriptioChangeClient_4 = this.formReel_4.controls["REELCLIENT_4"].valueChanges.subscribe(val => {
      if (typeof val == "undefined") this.formReel_4.controls["LABEL_CLIENT_4"].setValue("");
    })

    if (this.editMode == "add") {
      this.formComenzi.setValue(this.cantarireService.adaugareComanda())
    } else {
      this.cantarireService.editComanda().then(comData => {
        this.formComenzi.setValue(comData);
        this.disableElem();
      })
    }
  }

  disableElem() {
    this.disableButtons = true;
    this.formReel_1.controls["REELSORT_1"].disable();
    this.formReel_2.controls["REELSORT_2"].disable();
    this.formReel_3.controls["REELSORT_3"].disable();
    this.formReel_4.controls["REELSORT_4"].disable();
    this.formReel_1.controls["REELWIDTH_1"].disable();
    this.formReel_1.controls["REELSUBST_1"].disable();
    this.formReel_2.controls["REELWIDTH_2"].disable();
    this.formReel_2.controls["REELSUBST_2"].disable();
    this.formReel_3.controls["REELWIDTH_3"].disable();
    this.formReel_3.controls["REELSUBST_3"].disable();
    this.formReel_4.controls["REELWIDTH_4"].disable();
    this.formReel_4.controls["REELSUBST_4"].disable();
    this.formComenzi.controls["CANTITATE"].disable();
    this.formComenzi.controls["DIAM_INT"].disable();
    this.formComenzi.controls["DIAM_EXT"].disable();
    if (this.formReel_1.controls["REELWIDTH_1"].value == 0) {
      this.formReel_1.controls["REELCLIENT_1"].disable();
      this.disableClient1 = true;
    }
    if (this.formReel_2.controls["REELWIDTH_2"].value == 0) {
      this.formReel_2.controls["REELCLIENT_2"].disable();
      this.disableClient2 = true;
    }
    if (this.formReel_3.controls["REELWIDTH_3"].value == 0) {
      this.formReel_3.controls["REELCLIENT_3"].disable();
      this.disableClient3 = true;
    }
    if (this.formReel_4.controls["REELWIDTH_4"].value == 0) {
      this.formReel_4.controls["REELCLIENT_4"].disable();
      this.disableClient4 = true;
    }
  }

  getNGvalue(elem) {
    if (typeof elem == "undefined") return "";
    return elem && typeof elem == "object" ? elem.value : elem
  }

  onSubmit() {
    this.submit = true;
    if (this.formComenzi.invalid) return;
    const rawVals = this.formComenzi.getRawValue();
    let obj = {
      UID: rawVals["UID"],
      DATA: rawVals["DATA"],
      REELSORT_1: rawVals["formReelGroup"]["formReel_1"]["REELSORT_1"],
      REELCEPI_1: rawVals["formReelGroup"]["formReel_1"]["REELCEPI_1"],
      REELWIDTH_1: rawVals["formReelGroup"]["formReel_1"]["REELWIDTH_1"],
      REELSUBST_1: rawVals["formReelGroup"]["formReel_1"]["REELSUBST_1"],
      REELDEN_1: rawVals["formReelGroup"]["formReel_1"]["REELDEN_1"],
      REELCLIENT_1: this.getNGvalue(rawVals["formReelGroup"]["formReel_1"]["REELCLIENT_1"]),
      REELSORT_2: rawVals["formReelGroup"]["formReel_2"]["REELSORT_2"],
      REELCEPI_2: rawVals["formReelGroup"]["formReel_2"]["REELCEPI_2"],
      REELWIDTH_2: rawVals["formReelGroup"]["formReel_2"]["REELWIDTH_2"],
      REELSUBST_2: rawVals["formReelGroup"]["formReel_2"]["REELSUBST_2"],
      REELDEN_2: rawVals["formReelGroup"]["formReel_2"]["REELDEN_2"],
      REELCLIENT_2: this.getNGvalue(rawVals["formReelGroup"]["formReel_2"]["REELCLIENT_2"]),
      REELSORT_3: rawVals["formReelGroup"]["formReel_3"]["REELSORT_3"],
      REELCEPI_3: rawVals["formReelGroup"]["formReel_3"]["REELCEPI_3"],
      REELWIDTH_3: rawVals["formReelGroup"]["formReel_3"]["REELWIDTH_3"],
      REELSUBST_3: rawVals["formReelGroup"]["formReel_3"]["REELSUBST_3"],
      REELDEN_3: rawVals["formReelGroup"]["formReel_3"]["REELDEN_3"],
      REELCLIENT_3: this.getNGvalue(rawVals["formReelGroup"]["formReel_3"]["REELCLIENT_3"]),
      REELSORT_4: rawVals["formReelGroup"]["formReel_4"]["REELSORT_4"],
      REELCEPI_4: rawVals["formReelGroup"]["formReel_4"]["REELCEPI_4"],
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
    if (formcontrolName == "REELCLIENT_1") this.formReel_1.controls['LABEL_CLIENT_1'].setValue(ev.item.label)
    if (formcontrolName == "REELCLIENT_2") this.formReel_2.controls['LABEL_CLIENT_2'].setValue(ev.item.label)
    if (formcontrolName == "REELCLIENT_3") this.formReel_3.controls['LABEL_CLIENT_3'].setValue(ev.item.label)
    if (formcontrolName == "REELCLIENT_4") this.formReel_4.controls['LABEL_CLIENT_4'].setValue(ev.item.label)
  }

  onAdvanceSearchClient(valField, formcontrolName) {
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          if (formcontrolName == "REELCLIENT_1") {
            this.formReel_1.controls['REELCLIENT_1'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.formReel_1.controls['LABEL_CLIENT_1'].setValue(dataRow["NUME"])
          }
          if (formcontrolName == "REELCLIENT_2") {
            this.formReel_2.controls['REELCLIENT_2'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.formReel_2.controls['LABEL_CLIENT_2'].setValue(dataRow["NUME"])
          }
          if (formcontrolName == "REELCLIENT_3") {
            this.formReel_3.controls['REELCLIENT_3'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.formReel_3.controls['LABEL_CLIENT_3'].setValue(dataRow["NUME"])
          }
          if (formcontrolName == "REELCLIENT_4") {
            this.formReel_4.controls['REELCLIENT_4'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] })
            this.formReel_4.controls['LABEL_CLIENT_4'].setValue(dataRow["NUME"])
          }
        }
      })
      .catch(err => {
        // console.log(err) 
      })
  }

  searchSortiment = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nompOnlySortiment");
  }

  onselectSortiment(ev: NgbTypeaheadSelectItemEvent, reel: string) {
    if (ev.item.denumire) {
      if (reel == "REEL1") {
        this.formReel_1.controls["REELDEN_1"].setValue(ev.item.denumire);
      }
      if (reel == "REEL2") {
        this.formReel_2.controls["REELDEN_2"].setValue(ev.item.denumire);
      }
      if (reel == "REEL3") {
        this.formReel_3.controls["REELDEN_3"].setValue(ev.item.denumire);
      }
      if (reel == "REEL4") {
        this.formReel_4.controls["REELDEN_4"].setValue(ev.item.denumire);
      }
    }
    if (ev.item["CEPI"]) {
      if (reel == "REEL1") {
        this.formReel_1.controls["REELCEPI_1"].setValue(ev.item["CEPI"]);
      }
      if (reel == "REEL2") {
        this.formReel_2.controls["REELCEPI_2"].setValue(ev.item["CEPI"]);
      }
      if (reel == "REEL3") {
        this.formReel_3.controls["REELCEPI_3"].setValue(ev.item["CEPI"]);
      }
      if (reel == "REEL4") {
        this.formReel_4.controls["REELCEPI_4"].setValue(ev.item["CEPI"]);
      }

    }
  }

  onAdvanceSearchSortiment(valField, reel: string) {
    this.advanceSearchService
      .searchModal('searchOnlySortiment', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          const reelSort = { value: dataRow["CODP"], label: dataRow["DENUMIRE"] };
          if (reel == "REEL1") {
            this.formReel_1.controls["REELSORT_1"].setValue(reelSort);
            this.formReel_1.controls["REELDEN_1"].setValue(dataRow["DENUMIRE"]);
            this.formReel_1.controls["REELCEPI_1"].setValue(dataRow["CPSA"]);
          }
          if (reel == "REEL2") {
            this.formReel_2.controls["REELSORT_2"].setValue(reelSort);
            this.formReel_2.controls["REELDEN_2"].setValue(dataRow["DENUMIRE"]);
            this.formReel_2.controls["REELCEPI_2"].setValue(dataRow["CPSA"]);
          }
          if (reel == "REEL3") {
            this.formReel_3.controls["REELSORT_3"].setValue(reelSort);
            this.formReel_3.controls["REELDEN_3"].setValue(dataRow["DENUMIRE"]);
            this.formReel_3.controls["REELCEPI_3"].setValue(dataRow["CPSA"]);
          }
          if (reel == "REEL4") {
            this.formReel_4.controls["REELSORT_4"].setValue(reelSort);
            this.formReel_4.controls["REELDEN_4"].setValue(dataRow["DENUMIRE"]);
            this.formReel_4.controls["REELCEPI_4"].setValue(dataRow["CPSA"]);
          }

        }
      })
      .catch(err => { })
  }

  onAddSortiment(reel) {
    this.editNompService.openEditare()
      .then(data => {
        if (data) {
          const reelSort = { value: data["CODP"], label: data["DENUMIRE"] };
          if (reel == "REEL1") {
            this.formReel_1.controls["REELSORT_1"].setValue(reelSort);
            this.formReel_1.controls["REELDEN_1"].setValue(data["DENUMIRE"]);
            this.formReel_1.controls["REELCEPI_1"].setValue(data["CPSA"]);
          }
          if (reel == "REEL2") {
            this.formReel_2.controls["REELSORT_2"].setValue(reelSort);
            this.formReel_2.controls["REELDEN_2"].setValue(data["DENUMIRE"]);
            this.formReel_2.controls["REELCEPI_2"].setValue(data["CPSA"]);
          }
          if (reel == "REEL3") {
            this.formReel_3.controls["REELSORT_3"].setValue(reelSort);
            this.formReel_3.controls["REELDEN_3"].setValue(data["DENUMIRE"]);
            this.formReel_3.controls["REELCEPI_3"].setValue(data["CPSA"]);
          }
          if (reel == "REEL4") {
            this.formReel_4.controls["REELSORT_4"].setValue(reelSort);
            this.formReel_4.controls["REELDEN_4"].setValue(data["DENUMIRE"]);
            this.formReel_4.controls["REELCEPI_4"].setValue(data["CPSA"]);
          }
        }
      })
      .catch(err => { })
  }

  verifyValid(controlerName, formReel="formComenzi") {
    if (formReel == "formReel_1") return this.formReel_1.get(controlerName).invalid && this.submit;
    if (formReel == "formReel_2") return this.formReel_2.get(controlerName).invalid && this.submit;
    if (formReel == "formReel_3") return this.formReel_3.get(controlerName).invalid && this.submit;
    if (formReel == "formReel_4") return this.formReel_4.get(controlerName).invalid && this.submit;
    return this.formComenzi.get(controlerName).invalid && this.submit
  }

  reelvalidator(form: FormGroup): { [s: string]: boolean } {
    let REELWIDTH = 0;
    let REELSUBST = 0;
    let REELCLIENT;
    let REELCEPI = "";
    Object.keys(form.controls).forEach(key => {
      if (key.startsWith("REELWIDTH")) REELWIDTH = form.controls[key].value;
      if (key.startsWith("REELSUBST")) REELSUBST = form.controls[key].value;
      if (key.startsWith("REELCLIENT")) REELCLIENT = form.controls[key].value;
      if (key.startsWith("REELCEPI")) REELCEPI = form.controls[key].value;
    });
    REELWIDTH = REELWIDTH ? REELWIDTH : 0;
    REELSUBST = REELSUBST ? REELSUBST : 0;
    REELCLIENT = typeof REELCLIENT == "undefined" ? "" : REELCLIENT;
    REELCLIENT = typeof REELCLIENT == "object" && REELCLIENT ? REELCLIENT["value"] : REELCLIENT;

    if (REELWIDTH == 0 && REELSUBST == 0 && REELCLIENT == "" && REELCEPI == "") return null;
    if (REELWIDTH != 0 && REELSUBST != 0 && REELCEPI != "") return null;
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


  ngOnDestroy() {
    this.subscriptioChangeClient_1.unsubscribe();
    this.subscriptioChangeClient_2.unsubscribe();
    this.subscriptioChangeClient_3.unsubscribe();
    this.subscriptioChangeClient_4.unsubscribe();
    this.subscriptioChangeSort_1.unsubscribe();
    this.subscriptioChangeSort_2.unsubscribe();
    this.subscriptioChangeSort_3.unsubscribe();
    this.subscriptioChangeSort_4.unsubscribe();
  }
}
