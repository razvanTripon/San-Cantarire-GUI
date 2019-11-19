import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { NompService } from './nomp-service';
import { RowNode } from 'ag-grid-community';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nomp',
  templateUrl: './nomp.component.html',
  styleUrls: ['./nomp.component.scss']
})
export class NompComponent implements OnInit,OnDestroy {
  scrollTOCod="";
  subscription = new Subscription();
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  columnDefs = [
    { headerName: 'Cod sortiment', field: 'CODP', sortable: true, filter: true },
    { headerName: 'Denumire', field: 'DENUMIRE', sortable: true, filter: true },
    { headerName: 'Cod CEPI', field: 'CPSA', sortable: true, filter: true, width: 150 },
    { headerName: 'OBS.', field: 'OBS', sortable: true, filter: true,width:250 }
  ];
  constructor(private nompService: NompService, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.agGrid.getRowStyle= function(params) {
      if (params.node["data"]["PAR"] =="") {
          return { color: '#17A2B8','font-weight':'bold' }
      }
    }
    this.subscription.add(
      this.nompService.loadGridNomp$.subscribe(data => {
        this.rowData = this.nompService.getDateServerNomf();
      })
    );
    this.subscription.add(
      this.nompService.scrollToCod$.subscribe(codp => {
        if(codp!=null){
          this.scrollTOCod=codp
        }else{
          this.scrollTOCod="";
        }
      })
    );

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onRowDataChanged() {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if(this.scrollTOCod!=""){
        if(rowNode["data"]["CODP"]==this.scrollTOCod){
          rowNode.setSelected(true);
          this.agGrid.api.ensureNodeVisible(rowNode, 'top')
        }
      }else{
        if (index == 0){
          rowNode.setSelected(true);
        }
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
 
  onClose(){
    this.activeModal.close()
  }
}
