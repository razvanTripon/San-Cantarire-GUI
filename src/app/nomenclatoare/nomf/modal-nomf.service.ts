import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NomfComponent } from './nomf.component';

@Injectable({
  providedIn: 'root'
})
export class ModalNomfService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public openNomfModal(): Promise<boolean> {
    const modalRef = this.modalService.open(NomfComponent, { size: 'xl' });
    return modalRef.result;
  }
}





