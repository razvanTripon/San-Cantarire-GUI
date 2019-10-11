import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { AgGridNg2 } from 'ag-grid-angular/dist/agGridNg2';
import { PlanService } from '../../planuri/planuri.service';
import { TamburiService } from '../tamburi.service';
import { PlanificareModel } from '../../_models/planificare.model';
import { Subscription } from 'rxjs';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-grid-tamburi',
  templateUrl: './grid-tamburi.component.html',
  styleUrls: ['./grid-tamburi.component.scss']
})
export class GridTamburiComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  subscrDataServer: Subscription;
  subscriptionOnExportCSV: Subscription;
  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'PARENT', field: 'PARENT', hide: true },
    { headerName: 'Data Plan', field: 'DATA_PLAN', hide: true },
    { headerName: 'Nr. Plan', field: 'NR_PLAN', hide: true },
    { headerName: 'COD_PRODUS', field: 'COD_PRODUS', hide: true },
    { headerName: 'CLIENT', field: 'CLIENT', hide: true },
    { headerName: 'NR_COMANDA', field: 'NR_COMANDA', hide: true },
    { headerName: 'CANT_PLANIFICAT', field: 'CANT_PLANIFICAT', hide: true },
    { headerName: 'TIP', field: 'TIP', hide: true },
    { headerName: 'POZITIE_BOBINA', field: 'POZITIE_BOBINA', hide: true },
    { headerName: 'Pozitie tambur', field: 'POZITIE_TAMBUR', sortable: true, filter: true, rowDrag: true },
    { headerName: 'Cod Sortiment', field: 'COD_SORTIMENT', sortable: true, filter: true },
    { headerName: 'Denumire', field: 'DENUMIRE', width: 350, sortable: true, filter: true }
  ];
  constructor(private planService: PlanService, private tamburiService: TamburiService) {
  }
  onRowDragEnd() {
    const arr: PlanificareModel[] = [];
    this.agGrid.api.forEachNode((node, index) => {
      const dataRow = node.data
      dataRow["POZITIE_TAMBUR"] = index + 1;
      arr.push(node.data)
    })
    this.tamburiService.saveAllTaburi(arr).then(res => {
      this.agGrid.api.forEachLeafNode((rowNode) => {
        if (res.hasOwnProperty(rowNode.data["UID"])) {
          rowNode.setDataValue("POZITIE_TAMBUR", res[rowNode.data["UID"]]);
          rowNode.setDataValue("DENUMIRE", rowNode.data["DENUMIRE"]);
        }
      });
    })
  }
  ngOnInit() {
    this.subscrDataServer = this.planService.rowSelectedGridPlanificare$.subscribe((data: PlanificareModel) => {
      this.rowData = this.tamburiService.getDataServer$(data ? data["UID"] : null);
    });
    this.subscriptionOnExportCSV = this.tamburiService.exportCSVGridPlanificare$.subscribe(() => {
      this.agGrid.api.exportDataAsCsv({ fileName: 'Export tamburi.csv' });
    })
  }
  onRowSelected() { }
  onRowDataChanged() {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
    this.agGrid.api.setSuppressRowDrag(false);

  }
  onFilterChanged() {
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
  }
  onGridReady() {
  }
  ngOnDestroy() {
    this.subscrDataServer.unsubscribe();
    this.subscriptionOnExportCSV.unsubscribe();
  }
  onSelectionChanged() {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.tamburiService.onRowSelectGridTamburi(rowNode.data);
    })
  }
}
