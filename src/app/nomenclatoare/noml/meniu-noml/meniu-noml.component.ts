import { Component } from '@angular/core';
import { NomlService } from '../noml.service';
import { EditNomlService } from '../edit-noml/edit-noml.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';
import { EditAnexaNomlService } from '../edit-anexa-noml/edit-anexa-noml.service';

@Component({
  selector: 'app-meniu-noml',
  templateUrl: './meniu-noml.component.html',
  styleUrls: ['./meniu-noml.component.scss']
})
export class MeniuNomlComponent  {
  constructor(
    private nomlService: NomlService,
    private confirmationDialogService: ConfirmationDialogService,
    private alertService:AlertService,
    private editNomlService:EditNomlService,
    private editAnexaNomlService:EditAnexaNomlService
  ) { }

  onEdit() {
    const cod = this.nomlService.rowSelectedNoml$.getValue();
    if (cod != null) {
      this.editNomlService.openEditare(cod)
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }

  onAdd() {
    this.editNomlService.openEditare();
  }

  onDelete() {
    const cod = this.nomlService.rowSelectedNoml$.getValue();
    if (cod != null) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
      .then((confirmed) => {
        if (confirmed) {
          this.nomlService.deleteRow(cod)
        }
      })
      .catch(dd => { })
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
  openAnexa(){
    const cod = this.nomlService.rowSelectedNoml$.getValue();
    if (cod != null) {
      this.editAnexaNomlService.openEditare(cod);
    }else{
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai o comanda", size: "w-25", time: 5000 })
    }
  }

}
