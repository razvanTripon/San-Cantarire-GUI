import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { nomlModel } from './noml.model';
import { HelperService } from 'src/app/planificare/helper.service';

@Injectable({
  providedIn: 'root'
})
export class NomlService {
  data_ini: { year: number, month: number, day: number } = this.helper.getBootstrapDate(new Date());
  loadGridNoml$ = new Subject<boolean>();
  rowSelectedNoml$ = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private helper: HelperService) {
  }

  getDateServerNomf(): Observable<any> {
    this.rowSelectedNoml$.next(null);
    return this.http.get('/api/noml/getAllRows/')
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.statusText + " " + err.status)
        })
      )
  }

  getPlanModel(): nomlModel {
    return {
      COD: "",
      NUME: "",
      TAXE: "",
      OBS: "",
      PAR: "",
      VALOARE: 0,
      PRODUS: "",
      DATA_LAN: this.data_ini,
      DATA_INCH: this.data_ini,
      CANT: 0,
      CONTRACT: "",
      CC: "",
      PARTENER: "",
      COD_PROD: "",
      TIP_ACT: "",
      NR_ACT: "",
      DATA_ACT: "1900-01-01",
      LL_AA: "",
      STARE: "",
      RETETAR: ""
    }
  }

  getRowEditare(cod?: string): Promise<nomlModel> {
    return new Promise(resolve => {
      if (cod) {
        this.http.get('api/noml/getRow', { params: { cod: cod } }).toPromise().then(
          (data: any) => {
            data["DATA_LAN"] = this.helper.getBootstrapDate(new Date(data["DATA_LAN"]))
            data["DATA_INCH"] = this.helper.getBootstrapDate(new Date(data["DATA_INCH"]))
            resolve(data)
          }
        )
      } else {
        resolve(this.getPlanModel())
      }
    })
  }

  saveRow$(dataRow: nomlModel, op: string): Promise<any> {
//    console.log(dataRow)
    const cloneData: any = Object.assign(this.getPlanModel(), dataRow);
    if(!cloneData["PARTENER"]) cloneData["PARTENER"]={label :"", value:""}
//    console.log(cloneData)
    cloneData["DATA_LAN"] = this.helper.getJavascriptDate(cloneData["DATA_LAN"]);
    cloneData["DATA_INCH"] = this.helper.getJavascriptDate(cloneData["DATA_INCH"]);
    return this.http.post('api/noml/saveRow', cloneData, { params: { op } }).toPromise().then(
      (dataServer) => {
        return "ok";
      }
    )
  }

  deleteRow(cod: string) {
    this.http.get('api/noml/deleteRow', { params: { cod: cod } }).toPromise()
      .then((dataServer) => {
        this.loadGridNoml$.next(true)
      })
      .catch(err => { console.log(err) })
  }
  
}
