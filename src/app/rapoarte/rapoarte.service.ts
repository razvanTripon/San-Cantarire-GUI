import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertService } from '../_shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class RapoarteService {

  constructor(private http: HttpClient, private alertService:AlertService) { }

  downloadRepo(raportType: "raportDetaliat" | "raportSumar" | "notaPredare", rapParams: {}): void {
    let headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.ms-excel'
    });
    rapParams["type"]=raportType;
    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob', params: rapParams };
    this.http.get('/api/generateRaport', requestOptions).pipe(
      map((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = raportType+'.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    })).toPromise().then().catch((res:HttpErrorResponse)=>{
      this.alertService.emitAlert( {type: "danger",   message: "Generarea raportului a esuat", time:8000})
    });
  }
}
