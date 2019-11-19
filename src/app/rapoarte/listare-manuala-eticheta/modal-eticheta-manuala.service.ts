import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListareManualaEtichetaComponent } from './listare-manuala-eticheta.component';

@Injectable({
  providedIn: 'root'
})
export class ModalEtichetaManualaService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public openModal(): Promise<boolean> {
    const modalRef = this.modalService.open(ListareManualaEtichetaComponent, { size: 'lg' });
    return modalRef.result;
  }

}
