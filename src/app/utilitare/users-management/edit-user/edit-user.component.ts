import { Component, OnInit, Input, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  @Input('configDialog') configDialog;
  @Input('editMode') editMode;
  formEditareUsers: FormGroup;
  submit = false;

  constructor(
    private activeModal: NgbActiveModal,
    private usersService: UsersService,
    private fb: FormBuilder,

  ) {
    this.formEditareUsers = this.fb.group({
      'CODU': [""],
      'EMAIL': ["", [Validators.required]],
      'NUME_PRENUME': ["", Validators.required],
      'CNP': [""],
      'TEL': [""],
      'PASS': ["", Validators.required],
      'PASSCONFIRM': ["", Validators.required],
      'FACCES': [0, [Validators.required, Validators.max(99)]],

    })
    this.formEditareUsers.setValidators(this.passvalidator)
  }

  ngOnInit() {
    this.usersService.getRowEditare(this.configDialog["codu"]).then((rowData) => {
      for (let key in this.formEditareUsers.controls) {
        if (rowData.hasOwnProperty(key)) {
          this.formEditareUsers.controls[key].setValue(rowData[key]);
        }
      }
    })
  }

  onSubmit() {
    this.submit = true;
    if (this.formEditareUsers.invalid) return;
    this.usersService.saveRow$(this.formEditareUsers.getRawValue(), this.editMode ? "modify" : "add").then(
      servMesg => {
        if (servMesg == "ok") {
          this.usersService.loadGridUsers$.next(true);
          this.activeModal.close(this.formEditareUsers.getRawValue())
          this.formEditareUsers.reset();
        }
      }
    )
  }

  dismiss() {
    this.formEditareUsers.reset();
    this.activeModal.dismiss();
  }

  onCancel() {
    this.formEditareUsers.reset();
    this.activeModal.close();
  }
  passvalidator(form: FormGroup): { [s: string]: boolean } {
    const pass = form.controls["PASS"].value;
    const passconfit = form.controls["PASSCONFIRM"].value;
    if (pass != passconfit) return { invalid: true }
    return null
  }

}
