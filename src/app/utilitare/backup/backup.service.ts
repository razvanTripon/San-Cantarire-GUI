import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'src/app/_shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

  private server(url, params: {} = {}): Promise<any> {
    return this.http.get(url, { params: params }).toPromise()
      .then(data => {
        if (data["errMessage"]) {
          throw Error(data["errMessage"]);
        }
        this.alertService.emitAlert(
          {
            type: "success",
            message: "Datele au fost salvate, arhivate si sincronizate in Cloud. Nume arhiva " + data["file"],
            size: "w-50",
            time: 30000
          });
          return data;
      })
      .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
  }

  backupNow() {
    return this.server("/api/backupNow")
  }

}
