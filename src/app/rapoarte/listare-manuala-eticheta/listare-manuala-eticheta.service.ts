import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/_shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ListareManualaEtichetaService {
  constructor(private alertService: AlertService, private http: HttpClient) { }

  private getDataServer(url, params: {} = {}): Promise<any> {
    return this.http.get(url, { params: params }).toPromise()
      .then(data => {
        if (data["errMessage"]) {
          throw Error(data["errMessage"]);
        }
        return data
      })
      .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
  }

  getInfoCodp(cod_p: string): Promise<[]> {
    return this.getDataServer('/api/customList/infoCodProdus', { cod_p })
  }

  viewCustomEticheta(obj: {}): void {
    let headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });
    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob', params:  obj  };
    this.http.get('/api/viewCustomEticheta', requestOptions).pipe(map((data: any) => {
      let blob = new Blob([data], { type: 'application/pdf' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'EtichetaCustom.pdf';
      link.click();
      window.URL.revokeObjectURL(link.href);
    })).toPromise();
  }
  printCustomEticheta(obj: {}){
    return this.getDataServer('/api/printCustomEticheta', obj);
  }

}
