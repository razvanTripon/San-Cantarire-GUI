import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NompComponent } from './nomp.component';

@Injectable({ providedIn: 'root' })
export class ModalNompService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public openNompModal(): Promise<boolean> {
    const modalRef = this.modalService.open(NompComponent, { size: 'xl' });
    return modalRef.result;
  }
}



