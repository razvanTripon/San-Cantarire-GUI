import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditAnexaNomlComponent } from './edit-anexa-noml.component';

@Injectable()
export class EditAnexaNomlService {
    constructor(config: NgbModalConfig, private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(cod:string ): Promise<boolean> {
        const modalRef = this.modalService.open(EditAnexaNomlComponent, { size: 'lg' });
        modalRef.componentInstance.cod = cod;
        return modalRef.result;
    }
}
