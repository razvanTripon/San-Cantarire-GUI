import { Component, OnInit, OnDestroy } from '@angular/core';
import { RowNode } from 'ag-grid-community';
import { CantarireService } from '../cantarire.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cantarire-grid-bobine',
  templateUrl: './cantarire-grid-bobine.component.html',
  styleUrls: ['./cantarire-grid-bobine.component.scss']
})
export class CantarireGridBobineComponent implements OnInit, OnDestroy {
  agGrid;
  rowData;
  disableGridSelection;
  subscriptionTambur: Subscription;
  subscriptionNextBobina: Subscription;
  bobine = [];
  index_bobina = 0;
  numberOfRows = 0;
  selectedRow:RowNode;

  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'POZITIE BOBINA', field: 'POZITIE_BOBINA', width: 80 },
    { headerName: 'GRAMAJ', field: 'GRAMAJ', width: 90 },
    { headerName: 'COD', field: 'COD_PRODUS', width: 100 },
    
    { headerName: 'PRODUS', field: 'PRODUS', width: 130 },
    { headerName: 'LATIME', field: 'LATIME', width: 90 },
    { headerName: 'CLIENT', field: 'COD_CLIENT', width: 120 },
    { headerName: 'LABEL_CLIENT', field: 'LABEL_CLIENT', hide: true },
    { headerName: 'CANT. PLANIFICATA', field: 'CANT_PLANIFICAT', width: 140 },
    { headerName: 'CANT. REALIZATA', field: 'CANT_REALIZATA', width: 140 },
    { headerName: 'CANT. RAMASA', field: 'CANT_RAMASA', width: 140 }
  ];
  constructor(private cantarireService: CantarireService) {
    this.disableGridSelection = this.cantarireService.cantarireAutomata$;
  }

  ngOnInit() {
    this.subscriptionTambur = this.cantarireService.selectedTambur$.subscribe(data => {
      this.bobine = [];
      this.rowData = this.cantarireService.getBobineByTambur();
      setTimeout(() => {

      }, 100);
    })

    this.subscriptionNextBobina = this.cantarireService.selectNextBobina$.subscribe(data => {
 //      console.log(data)
      if (data && this.selectedRow) {
        if(typeof data =="object" && data!=null && data.hasOwnProperty("CANT_PLANIFICAT"))  this.selectedRow.setDataValue('CANT_PLANIFICAT',data["CANT_PLANIFICAT"])
        if(typeof data =="object" && data!=null && data.hasOwnProperty("CANT_RAMASA"))  this.selectedRow.setDataValue('CANT_RAMASA',data["CANT_RAMASA"])
        if(typeof data =="object" && data!=null && data.hasOwnProperty("CANT_REALIZATA"))  this.selectedRow.setDataValue('CANT_REALIZATA',data["CANT_REALIZATA"])
        this.selectNextBobina()
      }
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
        this.selectedRow=rowNode;
      }
    })
    // if(this.numberOfRows>0){
    //   this.selectNextBobina()
    // }
  }

  onSelectionChanged() {
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.selectedRow=rowNode;
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
            this.agGrid.ensureNodeVisible(this.bobine[i +1], 'bottom')
          }
          break;
        }
      }
    }
  }

  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();
  }
  ngOnDestroy() {
    this.subscriptionTambur.unsubscribe();
    this.subscriptionNextBobina.unsubscribe();
  }
}
