import { Component, OnInit, OnDestroy } from '@angular/core';
import { CantarireService } from '../cantarire.service';
import { Subscription } from 'rxjs';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-cantarire-grid-tamburi',
  templateUrl: './cantarire-grid-tamburi.component.html'
})
export class CantarireGridTamburiComponent implements OnInit, OnDestroy {
  rowData;
  disableGridSelection;
  agGrid;
  subscriptionPlan: Subscription;
  //uid,pozitie_tambur,cod_sortiment,nomp.denumire as sortiment,nomp.gramaj, nomp.diam_interior, nomp.diam_exterior
  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'POZITIE TAMBUR', field: 'POZITIE_TAMBUR', width: 140 },
    { headerName: 'COD SORTIMENT', field: 'COD_SORTIMENT', width: 140 },
    { headerName: 'GRAMAJ', field: 'GRAMAJ', width: 140 },
    { headerName: 'DIAM. INTERIOR', field: 'DIAM_INTERIOR', width: 140 },
    { headerName: 'DIAM. INTERIOR', field: 'DIAM_EXTERIOR', width: 140 }
  ];
  constructor(public cantarireService: CantarireService) {
    this.subscriptionPlan = this.cantarireService.selectedPlan$.subscribe(uidPlan => {
      this.rowData = this.cantarireService.getTamburiByPlan(uidPlan);
    })
    this.disableGridSelection = this.cantarireService.cantarireAutomata$;
  }

  ngOnInit() {
  }
  onRowSelected() {

  }
  onRowDataChanged() {
    this.agGrid.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
      }
    })
  }

  onSelectionChanged() {
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.cantarireService.selectedTambur$.next(rowNode.data);
      this.cantarireService.selectedBobina$.next(null);
    })
  }
  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();

  }
  ngOnDestroy() {
    this.subscriptionPlan.unsubscribe();
  }
}
