import { Component, OnInit } from '@angular/core';
import { RowNode } from 'ag-grid-community';
import { CantarireService } from '../cantarire.service';
import { Subscription } from 'rxjs';
import { EditComenziService } from './edit-comenzi/edit-comenzi.service';

@Component({
  selector: 'app-comenzi',
  templateUrl: './comenzi.component.html',
  styleUrls: ['./comenzi.component.scss']
})
export class ComenziComponent implements OnInit {
  titleSortiment = "";
  titleCepi = ""
  titleDiamInt = "";
  titleDiamExt = ""
  titleCantPlan = "";
  titleCantRealiz = "";
  titleCantRamasa = "";
  subsDisabled: Subscription;
  disabledMenu = false;
  cantitateaRamasa = 1000000;
  agGrid;
  rowData;
  disableGridSelection;
  subscriptionNextBobina: Subscription;
  subscriptionLoadGrid: Subscription;
  subscriptionUpdateGrid:Subscription;
  bobine = [];
  index_bobina = 0;
  numberOfRows = 0;
  selectedRow: RowNode;

  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'Latime Bobina', field: 'REELWIDTH', width: 150 },
    { headerName: 'Gramaj', field: 'REELSUBST', width: 150 },
    { headerName: 'Client', field: 'DEN_CLIENT', width: 300 },
    { headerName: 'Sortiment', field: 'DEN_SORT', width: 150 },
    { headerName: 'Cantitate(tone)', field: 'CANT', width: 150, type: "numericColumn" },
    { headerName: 'COD_CEPI', field: 'COD_CEPI', width: 50, hide: true },
    { headerName: 'COD_SORT', field: 'COD_SORT', width: 50, hide: true },
    { headerName: 'DEN_SORT', field: 'DEN_SORT', width: 50, hide: true },
    { headerName: 'DIAM_EXT', field: 'DIAM_EXT', width: 50, hide: true },
    { headerName: 'DIAM_INT', field: 'DIAM_INT', width: 50, hide: true },
    { headerName: 'UIDGENERAL', field: 'UIDGENERAL', width: 50, hide: true },
    { headerName: 'REELCLIENT', field: 'REELCLIENT', width: 50, hide: true }
  ];
  constructor(
    private cantarireService: CantarireService,
    private editComenziService: EditComenziService
  ) {
    this.disableGridSelection = this.cantarireService.cantarireAutomata$;

    this.subsDisabled = this.cantarireService.cantarireAutomata$.subscribe(
      (disabled: boolean) => {
        this.disabledMenu = disabled;
      })
  }

  onAdd() {
    this.editComenziService.openEditare("add");
  }

  onEdit() {
    this.editComenziService.openEditare("modify");
  }

  updateGridValues(dataServer: []) {
    if (dataServer) {
      dataServer.forEach((elem, index) => {
        let rowNodeFind = false;
        setTimeout(() => {
          if (this.agGrid) {
            this.agGrid.forEachNode((rowNode: RowNode, index: number) => {
              if (rowNode["data"]["UID"] == elem["UID"]) { //update row
                rowNodeFind = true;
                rowNode.setData(elem);
              }
            })
            if (rowNodeFind == false) this.agGrid.updateRowData({ add: [elem] })//add row
          }
        }, 50)
      })
    }
  }

  updateTitleBar(data) {
    if (data) {
      if (typeof data == "object" && data != null) {
        if (data.hasOwnProperty("CANT_REALIZATA")) {
          this.titleCantRealiz = "Cant Realiz: " + data["CANT_REALIZATA"];
        }
        if (data.hasOwnProperty("CANT_RAMASA")) {
          this.titleCantRamasa = "Cant Ramasa: " + data["CANT_RAMASA"];
          this.cantitateaRamasa = data["CANT_RAMASA"];
        }
        if (data.hasOwnProperty("DEN_SORT")) {
          this.titleSortiment = data["DEN_SORT"];
        }
        if (data.hasOwnProperty("COD_CEPI")) {
          this.titleCepi = " Cod CEPI:" + data["COD_CEPI"];
        }
        if (data.hasOwnProperty("DIAM_INT")) {
          this.titleDiamInt = "ØInt " + data["DIAM_INT"];
        }
        if (data.hasOwnProperty("DIAM_EXT")) {
          this.titleDiamExt = "ØExt " + data["DIAM_EXT"];
        }
        if (data.hasOwnProperty("CANT_PLANIFICAT")) {
          this.titleCantPlan = "Cant Plan:" + data["CANT_PLANIFICAT"];
        }
      }
    }
  }

  silentLoadGrid() {
    this.cantarireService.gridComanda().then(dataServer => {
      this.updateGridValues(dataServer["dataGrid"]);
      this.updateTitleBar(dataServer["dataTitle"]);
    })
  }
  loadGrid() {
    this.rowData = this.cantarireService.gridComanda().then(dataServer => {
      if (dataServer["dataTitle"]) {
        this.updateTitleBar(dataServer["dataTitle"]);
      }
      return dataServer["dataGrid"];
    });
  }

  ngOnInit() {
    this.subscriptionLoadGrid = this.cantarireService.loadDataGridComenzi$.subscribe(data => {
      if (data) {
        this.loadGrid();
      }
    })
    this.subscriptionNextBobina = this.cantarireService.selectNextBobina$.subscribe(data => {
      if (data) {
        this.silentLoadGrid();
        this.selectNextBobina()
      }
    })
    this.subscriptionUpdateGrid=this.cantarireService.updateGridComenzi$.subscribe(data=>{
      if(data) this.silentLoadGrid();
    })
  }

  onRowDataChanged() {
    this.bobine = [];
    this.numberOfRows = 0;
    this.agGrid.forEachNode((rowNode: RowNode, index: number) => {
      this.numberOfRows++;
      this.bobine.push(rowNode);
      if (index == 0) {
        rowNode.setSelected(true);
        this.selectedRow = rowNode;
        setTimeout(() => {
          this.cantarireService.loadDataGridProduse$.next(true)
        }, 200)

      }
    })
  }

  onSelectionChanged() {
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.selectedRow = rowNode;
      this.cantarireService.selectedBobina$.next(rowNode.data);
    })
  }

  selectNextBobina() {
    const selectedRowBobina = (this.cantarireService.selectedBobina$.getValue())
    if (this.bobine.length > 0 && selectedRowBobina == null) {
      this.bobine[0].setSelected(true);
    } else {
      for (let i = 0; i < this.bobine.length; i++) {
        const row = this.bobine[i]
        if (row.data["UID"] == selectedRowBobina["UID"]) {
          if (i == this.bobine.length - 1) {
            this.bobine[0].setSelected(true);
            this.agGrid.ensureNodeVisible(this.bobine[0], 'bottom')

          } else {
            this.bobine[i + 1].setSelected(true);
            this.agGrid.ensureNodeVisible(this.bobine[i + 1], 'bottom')
          }
          break;
        }
      }
    }
  }

  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();
 //   this.silentLoadGrid()
   this.loadGrid();
  }

  ngOnDestroy() {
    this.subscriptionNextBobina.unsubscribe();
    this.subscriptionLoadGrid.unsubscribe();
    this.subsDisabled.unsubscribe();
    this.subscriptionUpdateGrid.unsubscribe();
  }

}
