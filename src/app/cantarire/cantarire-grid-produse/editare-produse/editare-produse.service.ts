import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditareProduseComponent } from './editare-produse.component';

@Injectable()
export class EditareCantarireProduseService {
    constructor(config: NgbModalConfig,private modalService: NgbModal) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public openEditare(data: { UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, TIME_OP: string, CODOP: string }, editMode: "add" | "modify"): Promise<any> {
        const modalRef = this.modalService.open(EditareProduseComponent,{ size: 'lg' });
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.editMode = editMode;
        return modalRef.result;
    }
}
