import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CantarireService } from 'src/app/cantarire/cantarire.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';

@Component({
    selector: 'app-edit-setari-cantarire',
    templateUrl: "./edit-setari-cantarire.component.html"
})
export class EditSetariCantarireComponent implements OnInit {
    formOperare: FormGroup;
    submit = false;
    printers = [];
    btnDisabled = true;
    loadingPrinters = ""

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
            'MARJA_DIAMETRU': [0],
            'PAGER_ROTATE': [0]
        })
    }
    getPrinters() {
        this.loadingPrinters = "fa-spin";
        this.cantarireService.getPrinters().then(printers => {
            this.loadingPrinters = "";
            this.printers = ['', ...printers["PRINTERS"]]
            //console.log(printers)
        })
    }
    ngOnInit() {
        this.cantarireService.getSetariListare().then(dataSetari => {
            if (dataSetari) {
                if (dataSetari["PRINTERS"]) {
                    this.printers = [...dataSetari["PRINTERS"]]
                }
                setTimeout(() => {
                    for (const key in dataSetari) {
                        if (key != "PRINTERS")
                            this.formOperare.controls[key].setValue(dataSetari[key])
                    }
                    this.btnDisabled = false;
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
                this.cantarireService.setFormDetalii('MARJA', this.formOperare.controls["MARJA_DIAMETRU"].value)
                this.activeModal.close();
            }
        )
    }
}
