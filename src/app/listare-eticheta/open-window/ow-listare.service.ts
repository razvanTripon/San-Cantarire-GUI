import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenWindowComponent } from './open-window.component';

@Injectable({
  providedIn: 'root'
})
export class OwListareService {
  constructor(config: NgbModalConfig,private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
}
public openEditare(cod = "", fixedData = {}): Promise<boolean> {
    const configDialog = {}
    configDialog["cod"]=cod;
    configDialog["fixedData"] = fixedData;
    const modalRef = this.modalService.open(OpenWindowComponent, { size: 'lg' });
    modalRef.componentInstance.configDialog = configDialog;
    modalRef.componentInstance.editMode = cod == "" ? false : true;

    return modalRef.result;
}
}
