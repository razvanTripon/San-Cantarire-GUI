import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { NomfService } from './nomf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nomf',
  templateUrl: './nomf.component.html',
  styleUrls: ['./nomf.component.scss']
})
export class NomfComponent implements OnInit, OnDestroy {
  scrollTOCod = "";

  subscription = new Subscription();
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  columnDefs = [
    { headerName: 'Cod Partener', field: 'COD', sortable: true, filter: true },
    { headerName: 'Tip', field: 'TIP', sortable: true, filter: true, width: 100 },
    { headerName: 'Nume', field: 'NUME', sortable: true, filter: true },
    { headerName: 'Observatii', field: 'OBS', sortable: true, filter: true },
    { headerName: 'Str.', field: 'STR', sortable: true, filter: true, width: 150 },
    { headerName: 'Nr.', field: 'NR', sortable: true, filter: true },
    { headerName: 'Cod POSTAL', field: 'POSTAL', sortable: true, filter: true, width: 150 },
    { headerName: 'Localitate', field: 'LOCALITATE', sortable: true, filter: true, width: 150 },
    { headerName: 'Judet', field: 'JUDET', sortable: true, filter: true, width: 150 },
    { headerName: 'SECTOR', field: 'SECTOR', sortable: true, filter: true, width: 150 },
    { headerName: 'TARA', field: 'TARA', sortable: true, filter: true, width: 100 },
    { headerName: 'Tel', field: 'TEL', sortable: true, filter: true, width: 150 },
    { headerName: 'Fax', field: 'FAX', sortable: true, filter: true, width: 150 },
    { headerName: 'CAEN', field: 'CAEN', sortable: true, filter: true, width: 80 }
  ];
  constructor(private nomfService: NomfService) { }

  ngOnInit() {
    this.subscription.add(
      this.nomfService.loadGridNomf$.subscribe(data => {
        this.rowData = this.nomfService.getDateServerNomf();
      })
    )
    this.subscription.add(
      this.nomfService.scrollToCodPartener$.subscribe(cod => {
        if (cod != null) {
          this.scrollTOCod = cod
        } else {
          this.scrollTOCod = "";
        }
      })
    );

  }

  onRowDataChanged() {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if (this.scrollTOCod != "") {
        if (rowNode["data"]["COD"] == this.scrollTOCod) {
          rowNode.setSelected(true);
          this.agGrid.api.ensureNodeVisible(rowNode, 'top')
        }
      } else {
        if (index == 0) {
          rowNode.setSelected(true);
          this.nomfService.rowSelectedNomf$.next(rowNode.data["COD"])
        }
      }
    })
  }

  onFilterChanged() {
    this.nomfService.rowSelectedNomf$.next(null);
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.nomfService.rowSelectedNomf$.next(rowNode.data["COD"])
      }
    })
  }

  onSelectionChanged() {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.nomfService.rowSelectedNomf$.next(rowNode.data["COD"])
      // this.planService.onRowSelectGridPlanificare(rowNode.data);
    })
  }

  onGridReady() {
    this.nomfService.loadGridNomf$.next(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
