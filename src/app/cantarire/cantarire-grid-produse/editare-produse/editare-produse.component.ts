import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { NgbTypeaheadSelectItemEvent, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { Observable } from 'rxjs';
import { CantarireService } from '../../cantarire.service';

@Component({
  selector: 'app-editare-produse',
  templateUrl: './editare-produse.component.html',
  styleUrls: ['./editare-produse.component.scss']
})
export class EditareProduseComponent implements OnInit {
  formOperare: FormGroup;
  submit = false;
  labelClient = ""
  @Input('data') data;
  @Input('editMode') editMode;

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private fb: FormBuilder,
    public typeAheadService: TypeAheadService,
    private activeModal: NgbActiveModal,
    private cantarireService: CantarireService
  ) {
    this.formOperare = this.fb.group({
      'UID': [""],
      'PLAN': [""],
      'TAMBUR': [""],
      'BOBINA': [""],
      'COD_PRODUS': [""],
      'CLIENT': [{ value: "", label: "" }],
      'LABEL_CLIENT': [{ value: "", label: "" }],
      'NR_COMANDA': [""],
      'NR_TAMBUR': [""],
      'NR_BOBINA': [0, Validators.required],
      'TURA': [""],
      'LATIME': [0],
      'LUNGIME': [0, Validators.required],
      'DIAM_INTERIOR': [""],
      'DIAM_EXTERIOR': [0, Validators.required],
      'GREUTATE': [0, Validators.required],
      'DATA': [""],
      'TIME_OP': [""],
      'CODOP': [""]
    })
  }

  ngOnInit() {
    this.formOperare.setValue(this.data)
    this.formOperare.controls["CLIENT"].setValue({ value: this.data["CLIENT"], label: this.data["LABEL_CLEINT"] })
    this.labelClient = this.data["LABEL_CLIENT"]
  }

  onSubmit() {
    this.cantarireService.saveRowCantarire(this.formOperare.getRawValue(), this.editMode).then(
      dataServer=>{
          this.activeModal.close();
      }
    )
  }
  onCancel() {
    this.activeModal.close();
    this.formOperare.reset();
  }
  dismiss() {
    this.onCancel();
  }
  searchClient = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomf");
  }
  onselectClient(ev: NgbTypeaheadSelectItemEvent) {
    this.labelClient = ev.item.label;
  }
  onAdvanceSearchClient(valField) {
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          this.formOperare.controls['CLIENT'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] });
          this.labelClient = dataRow["NUME"];
        }
      })
      .catch(err => { console.log(err) })
  }
}
