import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HelperService } from 'src/app/planificare/helper.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { Observable } from 'rxjs';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { AnexaNomlService } from '../anexa-noml.service';
import { EditNompService } from 'src/app/nomenclatoare/nomp/edit-nomp/edit-nomp.service';

@Component({
  selector: 'app-edit-anexa2-noml',
  templateUrl: './edit-anexa2-noml.component.html',
  styleUrls: ['./edit-anexa2-noml.component.scss']
})
export class EditAnexa2NomlComponent implements OnInit {
  model: any = {
    onColor: 'success',
    offColor: 'secondary',
    onText: 'Auto add',
    offText: 'Auto add',
    disabled: false,
    size: '',
    value: false
  };
  formOperare: FormGroup;
  labelProdus = "";
  submit = false;
  @Input('uid') uid;
  @Input('luid') luid;
  editMode = false;
  constructor(
    private activeModal: NgbActiveModal,
    private http: HttpClient,
    private fb: FormBuilder,
    private helper: HelperService,
    public typeAheadService: TypeAheadService,
    private advanceSearchService: AdvanceSearchService,
    private alertService: AlertService,
    private anexaNomlService: AnexaNomlService,
    private editNompService:EditNompService,
  ) {
    this.formOperare = this.fb.group({
      'UID': ["", Validators.required],
      'LUID': ["", Validators.required],
      'COD_P': [{ value: "", label: "" }, this.typeAheadService.validatorTypeAhed],
      'CANT': [0, [Validators.min(0.1), Validators.required]]
    })
  }

  ngOnInit() {
    this.editMode = this.uid == null ? false : true;
    if (this.editMode) this.model.value = false;
    this.initForm();
    if (this.uid != null) {
      this.getDataServer()
    }
  }

  initForm() {
    this.submit = false;
    this.labelProdus = "";
    this.formOperare.reset();
    this.formOperare.controls['UID'].setValue(this.helper.getUID());
    this.formOperare.controls['LUID'].setValue(this.luid);
    this.formOperare.controls['CANT'].setValue(0);
  }

  dismiss() {
    this.activeModal.dismiss(this.formOperare.value);
  }

  onSubmit() {
    this.submit = true;
    if (this.formOperare.invalid) return;
    return this.http.post('api/nomlAnexa/saveRow', this.formOperare.getRawValue(), { params: { op: this.editMode ? "modify" : "add" } }).toPromise()
      .then(
        (dataServer) => {
          this.anexaNomlService.loadNomlAnexaGrid$.next(this.formOperare.getRawValue());
          if (!this.model.value) this.dismiss();
          this.initForm();
          this.editMode = false;
        })
      .catch((err: HttpErrorResponse) => {
        this.alertService.emitAlert({ type: "danger", message: err.message, size: "w-50" })
      })
  }

  getDataServer() {
    this.http.get("/api/nomlAnexa/getRow", { params: { uid: this.uid } }).toPromise().then(
      data => {
        this.formOperare.get('UID').setValue(data["UID"]);
        this.formOperare.get('LUID').setValue(data["LUID"]);
        this.formOperare.get('COD_P').setValue({ value: data["COD_P"], label: data["DENUMIRE"] });
        this.formOperare.get('CANT').setValue(data["CANT"]);
        this.labelProdus = data["DENUMIRE"];
      }
    )
  }

  searchProdus = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomp");
  }

  onselectProdus(ev: NgbTypeaheadSelectItemEvent) {
    this.labelProdus = ev.item.label;
  }

  onAdvanceSearchProdus(valField) {
    this.advanceSearchService
      .searchModal('searchNomp', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formOperare.controls['COD_P'].setValue({ value: dataRow["CODP"], label: dataRow["DENUMIRE"] });
          this.labelProdus = dataRow["DENUMIRE"];
        }
      })
      .catch(err => { console.log(err) })
  }

  autoAdd(flag: boolean) {
    this.model.value = flag
  }
  onAddProdus(){
    this.editNompService.openEditare()
    .then(data=>{
      if(data){
        this.formOperare.controls['COD_P'].setValue({ value: data["CODP"], label: data["DENUMIRE"] });
        this.labelProdus = data["DENUMIRE"];
      }
    })
    .catch(err=>{})
  }

}
