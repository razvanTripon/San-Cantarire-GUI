
import { Injectable } from '@angular/core';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditSetariCantarireComponent } from './edit-setari-cantarire.component';

@Injectable()
export class EditSetariCantarireService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  public openEditare( ): Promise<any> {
    const modalRef = this.modalService.open(EditSetariCantarireComponent, { size: 'lg' });
    return modalRef.result;
  }
}

