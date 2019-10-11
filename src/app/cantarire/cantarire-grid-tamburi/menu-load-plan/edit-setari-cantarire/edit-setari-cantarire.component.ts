import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CantarireService } from 'src/app/cantarire/cantarire.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';

@Component({
    template: `
<div class="modal-header" ngbAutofocus>
  <h4 class="modal-title"> Editare setari tiparire eticheta </h4>
  <button type="button" class="close" aria-label="Close" (click)="dismiss()">
      <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body">
  <form [formGroup]="formOperare" (ngSubmit)="onSubmit()" (keydown.enter)="$event.preventDefault()">
    <div class="form-group row mb-2">
        <h6 class="ml-4">Setari imprimanta</h6>
        <div class="col-12 input-group input-group-sm">
            <div class="input-group-prepend">
                <span class="input-group-text">PRINTER</span>
            </div>
            <select formControlName="PRINTER" class="form-control">
            <option *ngFor="let printer of printers">{{printer}}</option>
            </select>
        </div>
    </div>


    <div class="form-group row mb-2">
      <div class="col-12 input-group input-group-sm">
        <div class="input-group-prepend">
            <span class="input-group-text">Paper Format</span>
        </div>
        <select formControlName="PAPER_FORMAT" (change)="changeFormat()" class="form-control">
          <option value="">Custom values</option>
          <option value="Letter">Letter: 8.5in x 11in</option>
          <option value="Legal">Legal: 8.5in x 14in</option>
          <option value="Tabloid">Tabloid: 11in x 17in</option>
          <option value="Ledger">Ledger: 17in x 11in</option>
          <option value="A0">A0: 33.1in x 46.8in</option>
          <option value="A1">A1: 23.4in x 33.1in</option>
          <option value="A2">A2: 16.54in x 23.4in</option>
          <option value="A3">A3: 11.7in x 16.54in</option>
          <option value="A4">A4: 8.27in x 11.7in</option>
          <option value="A5">A5: 5.83in x 8.27in</option>
          <option value="A6">A6: 4.13in x 5.83in</option>
        </select>
      </div>
    </div>
    <div class="form-group row mb-2">
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Width</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_WIDTH'].invalid && this.submit}"  onfocus="this.select()"  formControlName="PAPER_WIDTH" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">in</span>
              </div>
          </div>
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Height</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_HEIGHT'].invalid && this.submit}"  onfocus="this.select()"  formControlName="PAPER_HEIGHT" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">in</span>
              </div>
          </div>
      </div>
      <div class="form-group row mb-2">
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Margin Top</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_MARGIN_TOP'].invalid && this.submit}" onfocus="this.select()"  formControlName="PAPER_MARGIN_TOP" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">mm</span>
              </div>
          </div>
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Margin Bottom</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_MARGIN_BOTTOM'].invalid && this.submit}" onfocus="this.select()" formControlName="PAPER_MARGIN_BOTTOM" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">mm</span>
              </div>
          </div>
      </div>
      <div class="form-group row mb-2">
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Margin Left</span>
              </div>
              <input onfocus="this.select()" [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_MARGIN_LEFT'].invalid && this.submit}"  formControlName="PAPER_MARGIN_LEFT" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">mm</span>
              </div>
          </div>
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Margin Right</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_MARGIN_RIGHT'].invalid && this.submit}" onfocus="this.select()"  formControlName="PAPER_MARGIN_RIGHT" class="form-control" type="number">
              <div class="input-group-append">
                  <span class="input-group-text">mm</span>
              </div>
          </div>
      </div>
      <div class="form-group row mb-2">
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Paper Orientation</span>
              </div>
              <select [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_ORIENTATION'].invalid && this.submit}" formControlName="PAPER_ORIENTATION" class="form-control">
                  <option value="LANDSCAPE">Landscape</option>
                  <option value="PORTRAIT">Portrait</option>
              </select>
          </div>
          <div class="col-6 input-group input-group-sm">
              <div class="input-group-prepend">
                  <span class="input-group-text">Number of copies</span>
              </div>
              <input [ngClass]="{'is-invalid':this.formOperare.controls['PAPER_COPIES'].invalid && this.submit}" onfocus="this.select()" formControlName="PAPER_COPIES" class="form-control" type="number">
          </div>
      </div>
      <h6 class="ml-3 mt-3">Setari diametru</h6>
      <div class="form-group row mb-2">
        <div class="col-6 input-group input-group-sm">
            <div class="input-group-prepend">
                <span class="input-group-text">Marja diametru</span>
            </div>
            <input onfocus="this.select()" formControlName="MARJA_DIAMETRU" class="form-control" type="number">
            <div class="input-group-append">
                <span class="input-group-text">cm</span>
             </div>
        </div>
      </div>

      <div class="modal-footer">
          <button [disabled]="btnDisabled" type="submit" class="btn btn-outline-primary"><i class="fa fa-check" aria-hidden="true"></i>
              Save</button>
          <button [disabled]="btnDisabled" type="button" class="btn btn-outline-danger" (click)="dismiss()"><i class="fa fa-ban"
                  aria-hidden="true"></i> Cancel</button>
      </div>
  </form>
</div>
  `
})
export class EditSetariCantarireComponent implements OnInit {
    formOperare: FormGroup;
    submit = false;
    printers = [];
    btnDisabled=true;
    constructor(
        private cantarireService: CantarireService,
        private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private alertService: AlertService
    ) {
        this.formOperare = this.fb.group({
            'PAPER_WIDTH': [0, Validators.required],
            'PAPER_HEIGHT': [0, Validators.required],
            'PAPER_FORMAT': [null],
            'PAPER_MARGIN_TOP': [0, Validators.required],
            'PAPER_MARGIN_BOTTOM': [0, Validators.required],
            'PAPER_MARGIN_LEFT': [0, Validators.required],
            'PAPER_MARGIN_RIGHT': [0, Validators.required],
            'PAPER_ORIENTATION': [null, Validators.required],
            'PAPER_COPIES': [1, Validators.required],
            'PRINTER': [null],
            'MARJA_DIAMETRU': [0]
        })
    }

    ngOnInit() {
        this.cantarireService.getSetariListare().then(dataSetari => {
            if (dataSetari) {
                if (dataSetari["PRINTERS"]) {
                    this.printers = ['',...dataSetari["PRINTERS"]]
                }
                setTimeout(() => {
                    for (const key in dataSetari) {
                        if (key != "PRINTERS")
                            this.formOperare.controls[key].setValue(dataSetari[key])
                    }
                    this.btnDisabled=false;
                }, 300)
            }
            this.changeFormat();
        })
    }

    dismiss() {
        this.activeModal.close();
    }

    changeFormat() {
        const PAPER_FORMAT = this.formOperare.controls["PAPER_FORMAT"].value;
        const PAPER_WIDTH = this.formOperare.controls["PAPER_WIDTH"];
        const PAPER_HEIGHT = this.formOperare.controls["PAPER_HEIGHT"];
        if (PAPER_FORMAT == "") {
            PAPER_WIDTH.enable();
            PAPER_HEIGHT.enable();
        } else {
            PAPER_WIDTH.disable();
            PAPER_HEIGHT.disable();
        }
    }

    onSubmit() {
        this.submit = true;
        if (this.formOperare.invalid) {
            this.alertService.emitAlert({ message: "Va rugam completati toate campurile", type: "danger" })
            return;
        }
        this.cantarireService.setSetariListare(this.formOperare.getRawValue()).then(
            dataServer => {
                this.activeModal.close();
            }
        )
    }
}
