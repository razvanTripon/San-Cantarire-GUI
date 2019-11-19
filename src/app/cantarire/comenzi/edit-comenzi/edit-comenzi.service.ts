import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComenziComponent } from './edit-comenzi.component';

@Injectable({
  providedIn: 'root'
})
export class EditComenziService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public openEditare( editMode: "add" | "modify"): Promise<any> {
    const modalRef = this.modalService.open(EditComenziComponent, { size: 'xl' });
    modalRef.componentInstance.editMode = editMode;
    return modalRef.result;
  }
}
