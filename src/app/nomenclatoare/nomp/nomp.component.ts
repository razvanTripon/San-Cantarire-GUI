import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { NompService } from './nomp-service';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-nomp',
  templateUrl: './nomp.component.html',
  styleUrls: ['./nomp.component.scss']
})
export class NompComponent implements OnInit,OnDestroy {

  subscription = new Subscription();
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  columnDefs = [
    { headerName: 'Cod produs', field: 'CODP', sortable: true, filter: true },
    { headerName: 'Tip', field: 'TIPMAT', sortable: true, filter: true, width:80 },
    { headerName: 'Sortiment', field: 'PAR', sortable: true, filter: true, width:100 },
    { headerName: 'Denumire', field: 'DENUMIRE', sortable: true, filter: true },
    { headerName: 'Um', field: 'UM', sortable: true, filter: true,width:80 },
    { headerName: 'Gramaj', field: 'GRAMAJ', sortable: true, filter: true },
    { headerName: 'Latime', field: 'LATIME', sortable: true, filter: true, width:150 },
    { headerName: 'Diam. Interior', field: 'DIAM_INTERIOR', sortable: true, filter: true,width:150 },
    { headerName: 'Diam. Exterior', field: 'DIAM_EXTERIOR', sortable: true, filter: true, width: 150 },
    { headerName: 'OBS.', field: 'OBS', sortable: true, filter: true,width:150 }
  ];
  constructor(private nompService: NompService) { }

  ngOnInit() {
    this.subscription.add(
      this.nompService.loadGridNomp$.subscribe(data => {
        this.rowData = this.nompService.getDateServerNomf();
      })
    )

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onRowDataChanged() {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
  }
  onFilterChanged() {
    this.nompService.rowSelectedNomp$.next(null);
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.nompService.rowSelectedNomp$.next(rowNode.data["CODP"]);
      }
    })
  }
  onSelectionChanged() {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.nompService.rowSelectedNomp$.next(rowNode.data["CODP"])
    })
  }
  onGridReady(){
    this.nompService.loadGridNomp$.next(true);
  }

}
