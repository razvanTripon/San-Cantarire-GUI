import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanificareModel } from '../../_models/planificare.model';
import { AgGridNg2 } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { TamburiService } from '../../tamburi/tamburi.service';
import { RowNode } from 'ag-grid-community';
import { BobineService } from '../bobine.service';

@Component({
  selector: 'app-grid-bobine',
  templateUrl: './grid-bobine.component.html',
  styleUrls: ['./grid-bobine.component.scss']
})
export class GridBobineComponent implements OnInit {
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  subscrDataServer: Subscription;
  subscriptionOnExportCSV: Subscription;
  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'PARENT', field: 'PARENT', hide: true },
    { headerName: 'Data Plan', field: 'DATA_PLAN', hide: true },
    { headerName: 'Nr. Plan', field: 'NR_PLAN', hide: true },
    { headerName: 'TIP', field: 'TIP', hide: true },
    { headerName: 'Pozitie tambur', field: 'POZITIE_TAMBUR', hide: true },
    { headerName: 'Cod Sortiment', field: 'COD_SORTIMENT', hide: true },
    { headerName: 'DEN COMANDA', field: 'DENUMIRE_NR_COMANDA', hide: true },

    { headerName: 'Pozitie Bobina', field: 'POZITIE_BOBINA', sortable: true, filter: true, rowDrag: true, width: 120 },
    { headerName: 'Cod', field: 'COD_PRODUS', sortable: true, filter: true, width: 100 },
    { headerName: 'Denumire', field: 'DENUMIRE_PRODUS', width: 250, sortable: true, filter: true },
    { headerName: 'Client', field: 'CLIENT', hide: true },
    { headerName: 'Client', field: 'DENUMIRE_CLIENT', width: 200, sortable: true, filter: true },
    { headerName: 'Nr. Comanda', field: 'NR_COMANDA', sortable: true, filter: true, width: 130 },
    { headerName: 'Cant. planificata', field: 'CANT_PLANIFICAT', sortable: true, filter: true, width: 160 }

  ];
  constructor(private bobineService: BobineService, private tamburiService: TamburiService) {
  }
  onRowDragEnd() {
    const arr: PlanificareModel[] = [];
    this.agGrid.api.forEachNode((node, index) => {
      const dataRow = node.data
      dataRow["POZITIE_BOBINA"] = index + 1;
      arr.push(node.data)
    })
    this.bobineService.saveAllBobine(arr).then(res => {
      this.agGrid.api.forEachLeafNode((rowNode) => {
        if (res.hasOwnProperty(rowNode.data["UID"])) {
          rowNode.setDataValue("POZITIE_BOBINA", res[rowNode.data["UID"]]);
          // rowNode.setDataValue("DENUMIRE", rowNode.data["DENUMIRE"]);
        }
      });
    })
  }
  ngOnInit() {
    this.subscrDataServer = this.tamburiService.rowSelectedGridTamburi$.subscribe((data: PlanificareModel) => {
      this.rowData = this.bobineService.getDataServer$(data ? data["UID"] : null);
    });
    this.subscriptionOnExportCSV = this.bobineService.exportCSVGridBobine$.subscribe(() => {
      this.agGrid.api.exportDataAsCsv({ fileName: 'Export bobine.csv' });
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
      this.bobineService.onRowSelectGridBobine(rowNode.data);
    })
  }

}
