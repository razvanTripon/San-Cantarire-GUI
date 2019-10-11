import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditNomlComponent } from './edit-noml.component';

@Injectable()
export class EditNomlService {
    constructor(config: NgbModalConfig, private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(cod = "", fixedData = {}): Promise<boolean> {
        const configDialog = {}
        configDialog["cod"] = cod;
        configDialog["fixedData"] = fixedData;
        const modalRef = this.modalService.open(EditNomlComponent, { size: 'lg' });
        modalRef.componentInstance.configDialog = configDialog;
        modalRef.componentInstance.editMode = cod == "" ? false : true;

        return modalRef.result;
    }
}
