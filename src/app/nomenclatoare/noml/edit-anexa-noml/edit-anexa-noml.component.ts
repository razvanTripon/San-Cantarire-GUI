import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RowNode } from 'ag-grid-community';
import { EditAnexa2NomlService } from './edit-anexa2-noml/edit-anexa2-noml.service';
import { AnexaNomlService } from './anexa-noml.service';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-edit-anexa-noml',
  templateUrl: './edit-anexa-noml.component.html',
  styleUrls: ['./edit-anexa-noml.component.scss']
})
export class EditAnexaNomlComponent implements OnInit, OnDestroy {
  @Input('cod') cod;
  subscription: Subscription;
  // @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  agGrid;
  rowsDataGrid;
  selectedRow;
  disabledOk = true;
  columnDefs = [
    { headerName: 'UID', field: 'UID', sortable: true, width: 140, hide: true },
    { headerName: 'Cod produs', field: 'COD_P', sortable: true, width: 140 },
    { headerName: 'Denumire', field: 'DENUMIRE', sortable: true, width: 250 },
    { headerName: 'Cantitate', field: 'CANT', sortable: true, width: 250 }
  ]

  constructor(
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private activeModal: NgbActiveModal,
    private http: HttpClient,
    private editAnexa2NomlService: EditAnexa2NomlService,
    private anexaNomlService: AnexaNomlService) { }

  ngOnInit() {
    this.subscription = this.anexaNomlService.loadNomlAnexaGrid$.subscribe(
      (data => {
        this.getDataServer();
      })
    )
  }

  closeModal() {
    this.activeModal.close(this.anexaNomlService.loadNomlAnexaGrid$.getValue());
  }

  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();
    this.getDataServer();
  }

  onSelectionChanged(event) {
    this.disabledOk = true;
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.selectedRow = rowNode.data;
    })
  }

  onRowDataChanged(ev) {
    this.agGrid.forEachNode((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.selectedRow = rowNode.data;
      }
    })
  }

  onFilterChanged(ev) {
    this.agGrid.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.selectedRow = rowNode.data;
      }
    })
  }

  getDataServer() {
    this.rowsDataGrid = this.http.get("/api/nomlAnexa/getRows", { params: { cod: this.cod } })
      .toPromise()
      .catch(err => { console.log(err) })
  }
  onAddAnexa() {
    this.editAnexa2NomlService.openEditare(this.cod)
      .then(data => { 
        //console.log(data) 
      })
      .catch(err => {
        // console.log(err)
      })
  }
  onEditAnexa() {
    if (this.selectedRow) {
      this.editAnexa2NomlService.openEditare(this.cod, this.selectedRow["UID"])
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
  onDeleteAnexa() {
    if (this.selectedRow) {
      this.confirmationDialogService.confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed) => {
          if (confirmed) {
            this.rowsDataGrid = this.http.get("/api/nomlAnexa/deleteRow", { params: { uid: this.selectedRow["UID"] } }).toPromise()
              .then(() => {
                this.anexaNomlService.loadNomlAnexaGrid$.next(null)
              })
              .catch((err: HttpErrorResponse) => {
                this.alertService.emitAlert({ type: "danger", message: err.message, size: "w-50", time: 5000 })
              })
          }
        })
        .catch(err => console.log(err))
    } else {
      this.alertService.emitAlert({ type: "danger", message: "Va rugam selectati mai intai un rand", size: "w-25", time: 5000 })
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
