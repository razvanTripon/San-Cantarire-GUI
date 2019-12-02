import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewLogsComponent } from './view-logs.component';

@Injectable({
  providedIn: 'root',
})

export class ModalViewLogsService {

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public openModalView(): Promise<boolean> {
    const modalRef = this.modalService.open(ViewLogsComponent, { size: 'xl', scrollable: true});
    return modalRef.result;
  }
}








