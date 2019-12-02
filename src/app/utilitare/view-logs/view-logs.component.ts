import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewLogsService } from './view-logs.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  accessLog = [];
  daemon = [];
  traductoriEvents = [];
  lastElem = "";
  loading=false;
  constructor(
    private activeModal: NgbActiveModal,
    private viewService: ViewLogsService

  ) {

  }
  onload(elem = "") {
    this.loading=true;
    if (elem == "") elem = this.lastElem;
    this.lastElem = elem;
    $('#divLog').empty();
    $('#divLog').load('/logs/' + elem, () => {
      this.loading=false;
    })
  }

  ngOnInit() {
    this.viewService.getLogsName().then(data => {
      if (data) {
        if (data["accessLog"]) this.accessLog = data["accessLog"]
        if (data["daemon"]) this.daemon = data["daemon"]
        if (data["traductoriEvents"]) this.traductoriEvents = data["traductoriEvents"]
      }
    });
  }

  onClose() {
    // this.activeModal.close()
  }

  dismiss() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.viewService.emptyTmpLog()
  }
}
