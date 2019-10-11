import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditAnexa2NomlComponent } from './edit-anexa2-noml.component';

@Injectable()
export class EditAnexa2NomlService {
    constructor(config: NgbModalConfig,private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(luid: string, uid?: string): Promise<any> {
        const modalRef = this.modalService.open(EditAnexa2NomlComponent);
        modalRef.componentInstance.uid = uid ? uid : null;
        modalRef.componentInstance.luid = luid;
        return modalRef.result;
    }
}
