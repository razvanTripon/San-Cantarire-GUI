import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/_shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ViewLogsService {
  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  getLogsName(params = {}) {
    return this.http.get('/api/getLogsName').toPromise()
      .catch((err: HttpErrorResponse) => {
        this.alertService.emitAlert({ message: err.message, type: "danger" })
      })

  }
  emptyTmpLog(){
    return this.http.get('/api/emptyTmpLog').toPromise()
    .catch((err: HttpErrorResponse) => {
      this.alertService.emitAlert({ message: err.message, type: "danger" })
    })
  }

}
