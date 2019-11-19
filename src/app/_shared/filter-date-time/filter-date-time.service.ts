import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterDateTimeComponent } from './filter-date-time.component';

@Injectable({
  providedIn: 'root'
})
export class FilterDateTimeService {
  constructor(private modalService: NgbModal) { }
  public getParams(
      title: string,
      btnOkText: string = 'OK',
      btnCancelText: string = 'Cancel',
      dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
      const modalRef = this.modalService.open(FilterDateTimeComponent, { size: dialogSize });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.btnOkText = btnOkText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
  }

}
