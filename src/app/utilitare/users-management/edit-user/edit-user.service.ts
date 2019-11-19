import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditUserComponent } from './edit-user.component';

@Injectable()
export class EditUserService {
    constructor(config: NgbModalConfig,private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(codu = "", fixedData = {}): Promise<boolean> {
        const configDialog = {}
        configDialog["codu"]=codu;
        configDialog["fixedData"] = fixedData;
        const modalRef = this.modalService.open(EditUserComponent, { size: 'lg' });
        modalRef.componentInstance.configDialog = configDialog;
        modalRef.componentInstance.editMode = codu == "" ? false : true;

        return modalRef.result;
    }
}
