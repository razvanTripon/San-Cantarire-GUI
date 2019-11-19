import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { UsersService } from '../users.service';
import { EditUserService } from '../edit-user/edit-user.service';

@Component({
  selector: 'app-meniu-users',
  templateUrl: './meniu-users.component.html',
  styleUrls: ['./meniu-users.component.scss']
})
export class MeniuUsersComponent implements OnInit {

  constructor(private usersService: UsersService,
    private editusersService: EditUserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
  }
  onEdit() {
    const cod = this.usersService.rowSelectedUsers$.getValue();
    if (cod != null) {
      this.editusersService.openEditare(cod);
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }

  onAdd() {
    this.editusersService.openEditare();
  }
  
  onDelete() {
    const cod = this.usersService.rowSelectedUsers$.getValue();
    if (cod != null) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed) => {
          if (confirmed) {
            this.usersService.deleteRow(cod)
          }
        })
        .catch(dd => { })

    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }

}
