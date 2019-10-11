import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';

import { AgGridNg2 } from 'ag-grid-angular';
import { PlanService } from '../planuri.service';
import { Subscription } from 'rxjs';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-grid-planificare',
  templateUrl: './grid-planificare.component.html',
  styleUrls: ['./grid-planificare.component.scss']
})
export class GridPlanificareComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  subscriptionEvent: Subscription;
  subscriptionOnExportCSV: Subscription;
  rowData;
  columnDefs = [
    { headerName: 'UID', field: 'UID', sortable: true, filter: true, hide: true },
    { headerName: 'PARENT', field: 'PARENT', sortable: true, filter: true, hide: true },
    { headerName: 'Data Plan', field: 'DATA_PLAN', sortable: true, filter: true },
    { headerName: 'Nr. Plan', field: 'NR_PLAN', sortable: true, filter: true },
    { headerName: 'Denumire', field: 'DENUMIRE', sortable: true, filter: true, width: 350 },
    { headerName: 'POZITIE_TAMBUR', field: 'POZITIE_TAMBUR', sortable: true, filter: true, hide: true },
    { headerName: 'COD_SORTIMENT', field: 'COD_SORTIMENT', sortable: true, filter: true, hide: true },
    { headerName: 'POZITIE_BOBINA', field: 'POZITIE_BOBINA', sortable: true, filter: true, hide: true },
    { headerName: 'COD_PRODUS', field: 'COD_PRODUS', sortable: true, filter: true, hide: true },
    { headerName: 'CLIENT', field: 'CLIENT', sortable: true, filter: true, hide: true },
    { headerName: 'NR_COMANDA', field: 'NR_COMANDA', sortable: true, filter: true, hide: true },
    { headerName: 'CANT_PLANIFICAT', field: 'CANT_PLANIFICAT', sortable: true, filter: true, hide: true },
    { headerName: 'TIP', field: 'TIP', sortable: true, filter: true, hide: true }
  ];

  constructor(public planService: PlanService) {
  }
  ngOnInit() {
    this.subscriptionOnExportCSV = this.planService.exportCSVGridPlanificare$.subscribe(() => {
      var params = {
        fileName: 'Export planificare productie.csv',
      }
      this.agGrid.api.exportDataAsCsv(params);
    })
  }
  onRowDataChanged(params) {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
  }
  onFilterChanged(event) {
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
  }
  onGridReady(params) {
    this.subscriptionEvent = this.planService.filter.subscribe(
      data => {
        this.rowData = this.planService.getRowsPlanificare()
      }
    )
  }
  onSelectionChanged(event) {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.planService.onRowSelectGridPlanificare(rowNode.data);
    })
  }
  onRowSelected(event) {
    // console.log("")
  }
  ngOnDestroy() {
    this.subscriptionEvent.unsubscribe();
    this.subscriptionOnExportCSV.unsubscribe();
  }
}
/////https://stackoverflow.com/questions/45700025/programmatically-select-a-row-ag-grid-angular-2
//////https://www.ag-grid.com/javascript-grid-rxjs/
///https://www.js-tutorials.com/angularjs-tutorial/ag-grid-crud-example-using-http-rest-service-angular-5/
///https://medium.com/quick-code/creating-advanced-visual-reports-with-angular-750a1858f194