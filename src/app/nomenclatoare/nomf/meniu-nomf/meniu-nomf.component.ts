import { Component, OnInit } from '@angular/core';
import { NomfService } from '../nomf.service';
import { EditNomfService } from '../edit-nomf/edit-nomf.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-meniu-nomf',
  templateUrl: './meniu-nomf.component.html',
  styleUrls: ['./meniu-nomf.component.scss']
})
export class MeniuNomfComponent implements OnInit {

  constructor(
    private nomfService: NomfService,
    private editNomfService: EditNomfService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
  }
  onExportCSV() {
  }
  onEdit() {
    const cod = this.nomfService.rowSelectedNomf$.getValue();
    if (cod != null) {
      this.editNomfService.openEditare(cod).then(data => {
        if (data && data.hasOwnProperty("COD")) this.nomfService.scrollToCodPartener$.next(data["COD"])
      })
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
  onAdd() {
    this.editNomfService.openEditare().then(data => {
      if (data && data.hasOwnProperty("COD")) this.nomfService.scrollToCodPartener$.next(data["COD"])
    });
  }
  onDelete() {
    const cod = this.nomfService.rowSelectedNomf$.getValue();
    if (cod != null) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed) => {
          if (confirmed) {
            this.nomfService.deleteRow(cod)
          }
        })
        .catch(dd => { })

    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
}
