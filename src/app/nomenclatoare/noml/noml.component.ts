import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { NomlService } from './noml.service';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-noml',
  templateUrl: './noml.component.html',
  styleUrls: ['./noml.component.scss']
})
export class NomlComponent implements OnInit {
  subscription = new Subscription();
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  columnDefs = [
    { headerName: 'Cod', field: 'COD', sortable: true, filter: true,width:120 },
    { headerName: 'Denumire', field: 'NUME', sortable: true, filter: true, width:250 },
    { headerName: 'Data Inceput', field: 'DATA_LAN', sortable: true, filter: true,width:140 },
    { headerName: 'Data Finala', field: 'DATA_INCH', sortable: true, filter: true,width:140 },
    { headerName: 'Partener', field: 'PARTENER', sortable: true, filter: true,width:120 },
    { headerName: 'OBS.', field: 'OBS', sortable: true, filter: true}
  ];
  constructor(private nomlService: NomlService) { }

  ngOnInit() {
    this.subscription.add(
      this.nomlService.loadGridNoml$.subscribe(data => {
        this.rowData = this.nomlService.getDateServerNomf();
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
        this.nomlService.rowSelectedNoml$.next(rowNode.data["COD"])
      }
    })
  }
  onFilterChanged() {
    this.nomlService.rowSelectedNoml$.next(null);
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.nomlService.rowSelectedNoml$.next(rowNode.data["COD"])
      }
    })
  }
  onSelectionChanged() {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.nomlService.rowSelectedNoml$.next(rowNode.data["COD"])
    })
  }
  onGridReady(){
    this.nomlService.loadGridNoml$.next(true);
  }


}
