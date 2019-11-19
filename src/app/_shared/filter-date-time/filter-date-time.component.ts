import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-filter-date-time',
  templateUrl: './filter-date-time.component.html',
  styleUrls: ['./filter-date-time.component.scss']
})
export class FilterDateTimeComponent {

  @Input() title: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  formFilter: FormGroup;
  submit = false;
  data_ini = this.helper.getBootstrapDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  data_fin = this.helper.getBootstrapDate(new Date());

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private helper: HelperService,
    config: NgbTimepickerConfig) {

      config.spinners = false;
    this.formFilter = this.fb.group({
      'DATA_INI': [this.data_ini],
      'DATA_FIN': [this.data_fin],
      'TIME_INI': [{ hour: 7, minute: 0 }, Validators.required],
      'TIME_FIN': [{ hour: 7, minute: 0 }, Validators.required],

    })
  }

  getCorectTime(dataObj){
    const hh = dataObj.hour < 10 ? `0${dataObj.hour}` : dataObj.hour;
    const mm = dataObj.minute < 10 ? `0${dataObj.minute}` : dataObj.minute;
    return `${hh}:${mm}`;
  }

  onSubmit() {
    this.submit = true;
    if(this.formFilter.invalid) return
    const dataForm=this.formFilter.getRawValue();
    this.activeModal.close({
      DATA_INI:this.helper.getJavascriptDate(dataForm["DATA_INI"]),
      DATA_FIN:this.helper.getJavascriptDate(dataForm["DATA_FIN"]),
      TIME_INI:this.getCorectTime(dataForm["TIME_INI"]),
      TIME_FIN:this.getCorectTime(dataForm["TIME_FIN"]),
    });
  }
  public decline() {
    this.activeModal.close();
  }

  public dismiss() {
    this.activeModal.close();
  }

}
