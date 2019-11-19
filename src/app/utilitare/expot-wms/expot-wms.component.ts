import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { SetariGeneraleService } from 'src/app/_services/setari-generale.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expot-wms',
  templateUrl: './expot-wms.component.html',
  styleUrls: ['./expot-wms.component.scss']
})
export class ExpotWMSComponent implements OnInit, OnDestroy {
  formBobine: FormGroup;
  submit = false;
  caleSalvareLocala: "";
  subcription: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private http: HttpClient,
    private stg: SetariGeneraleService


  ) {
    this.formBobine = this.fb.group({
      'bobina_ini': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'bobina_fin': [0, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      'salvare':["DA"]
    })
    // this.caleSalvareLocala=this.stg.setariGenerale["bobina_CSV"]["localSave"]

  }
  ngOnInit() {
    this.subcription = this.stg.setariGenerale$.subscribe(val => {
      if(val)
      this.caleSalvareLocala = val["bobina_CSV_local"];
    })
  }
  onSubmit() {
    this.submit = true;
    if (this.formBobine.invalid) {
      this.alertService.emitAlert({
        message: `
      Va rugam completati atat campul de numar bobina initiala cat si cel de numar bobina finala.
       In cazul in care doriti exportul unei singure bobine completati acelasi numar in ambele campuri`, type: "danger"
      })
      return;
    }
    this.http.get('/api/generateCSV', { params: this.formBobine.value }).toPromise()
      .then(data => {
        if (data["gen"]) this.alertService.emitAlert({ message: "Exportul a fost generat cu success", type: "success" })
      })
      .catch(err => {
        this.alertService.emitAlert({ message: "Eroare " + err, type: "danger" })
      })
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.close();
  }
  ngOnDestroy() {
    this.subcription.unsubscribe()
  }

}
