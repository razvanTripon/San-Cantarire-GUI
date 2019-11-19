import { Injectable } from '@angular/core';
import { ExpotWMSComponent } from './expot-wms.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalBobineWMSService {

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  public showModal( ): Promise<any> {
    const modalRef = this.modalService.open(ExpotWMSComponent, { size: 'lg' });
    return modalRef.result;
  }
}
