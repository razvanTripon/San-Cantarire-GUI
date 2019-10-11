import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { RowNode } from 'ag-grid-community';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  @Input() configDialog;
  formSearch: FormGroup;
  agGrid;
  rowsDataGrid;
  selectedRow;
  disabledOk = true;

  constructor(private activeModal: NgbActiveModal, private http: HttpClient, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formSearch = this.fb.group({
      'search': [this.configDialog.searchInitialValue]
    })
    if (this.configDialog.searchInitialValue != "") {
      this.onSearch();
    } else {
      if (this.configDialog.preloadRows) this.onSearch();
    }
  }
  public decline() {
    this.activeModal.close();
  }

  public accept() {
    this.activeModal.close(this.selectedRow);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();
  }

  onSelectionChanged(event) {
    this.disabledOk = true;
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.selectedRow = rowNode.data;
      this.disabledOk = false;
    })
  }

  onRowDataChanged(ev) {
    this.disabledOk = true;
  }

  onFilterChanged(ev) {
    this.disabledOk = true;
  }

  onSearch() {
    this.getDataServer();
  }

  getDataServer() {
    const queryParams = this.configDialog.queryParams;
    queryParams.search = this.formSearch.get("search").value;
    this.rowsDataGrid = this.http.get(this.configDialog.api_server, { params: queryParams })
      .toPromise()
      .catch(err => { console.log(err) })
  }
}