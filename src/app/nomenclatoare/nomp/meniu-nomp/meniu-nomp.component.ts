import { Component } from '@angular/core';
import { NompService } from '../nomp-service';
import { EditNompService } from '../edit-nomp/edit-nomp.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-meniu-nomp',
  templateUrl: './meniu-nomp.component.html',
  styleUrls: ['./meniu-nomp.component.scss']
})
export class MeniuNompComponent {
  constructor(
    private nompService: NompService,
    private confirmationDialogService: ConfirmationDialogService,
    private editNompService: EditNompService,
    private alertService: AlertService
  ) { }

  onEdit() {
    const cod = this.nompService.rowSelectedNomp$.getValue();
    if (cod != null) {
      this.editNompService.openEditare(cod).then(data => {
        if (data && data.hasOwnProperty("CODP")) this.nompService.scrollToCod$.next(data["CODP"])
      })
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
  onAdd() {
    this.editNompService.openEditare().then(data => {
      if (data && data.hasOwnProperty("CODP")) this.nompService.scrollToCod$.next(data["CODP"])
    });
  }
  onDelete() {
    const cod = this.nompService.rowSelectedNomp$.getValue();
    if (cod != null) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed) => {
          if (confirmed) {
            this.nompService.deleteRow(cod)
          }
        })
        .catch(dd => { })
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
}
