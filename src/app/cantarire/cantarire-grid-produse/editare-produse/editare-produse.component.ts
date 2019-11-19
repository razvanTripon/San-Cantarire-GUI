import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { CantarireService } from '../../cantarire.service';

@Component({
  selector: 'app-editare-produse',
  templateUrl: './editare-produse.component.html',
  styleUrls: ['./editare-produse.component.scss']
})
export class EditareProduseComponent implements OnInit {
  formOperare: FormGroup;
  submit = false;
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
      'TAMBUR': [""],
      'BOBINA': [""],
      'COD_SORT': [""],
      'DEN_SORT': [""],
      'COD_CEPI': [""],
      'GRAMAJ':[""],
      'CLIENT': [""],
      'DEN_CLIENT': [""],
      'NR_TAMBUR': [0, Validators.required],
      'NR_BOBINA': [0, Validators.required],
      'TURA': [""],
      'LATIME': [0],
      'LUNGIME': [0, Validators.required],
      'DIAM_INTERIOR': [""],
      'DIAM_EXTERIOR': [0, Validators.required],
      'GREUTATE': [0, Validators.required],
      'DATA': [""],
      'CODOP': [""],
      'DIAM_TRADUCTOR':[0]
    })
  }

  ngOnInit() {
    this.formOperare.setValue(this.data)
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

}
