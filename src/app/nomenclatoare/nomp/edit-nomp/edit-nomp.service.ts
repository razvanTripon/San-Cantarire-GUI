import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditNompComponent } from './edit-nomp.component';

@Injectable()
export class EditNompService {
    constructor(config: NgbModalConfig,private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(codp = "", fixedData = {}): Promise<boolean> {
        const configDialog = {}
        configDialog["codp"]=codp;
        configDialog["fixedData"] = fixedData;
        const modalRef = this.modalService.open(EditNompComponent, { size: 'lg' });
        modalRef.componentInstance.configDialog = configDialog;
        modalRef.componentInstance.editMode = codp == "" ? false : true;

        return modalRef.result;
    }
}
