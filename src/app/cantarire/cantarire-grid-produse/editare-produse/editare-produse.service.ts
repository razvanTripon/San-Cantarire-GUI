import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditareProduseComponent } from './editare-produse.component';

@Injectable()
export class EditareCantarireProduseService {
    constructor(config: NgbModalConfig,private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(data: any, editMode: "add" | "modify"): Promise<any> {
        const modalRef = this.modalService.open(EditareProduseComponent,{ size: 'lg' });
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.editMode = editMode;
        return modalRef.result;
    }
}
