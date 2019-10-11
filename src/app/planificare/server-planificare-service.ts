import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { PlanificareModel } from './_models/planificare.model';

@Injectable()
export class ServerPlanificareService {
  constructor(private http: HttpClient) { }

  saveDataPlanificare(rowData: PlanificareModel, op: string): Observable<any> {
    return this.http.post('/api/planificare/saveData/', rowData, { params: { op: op } })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.statusText + " " + err.status)
        })
      )
  }
  deleteDataPlanificare(uid:string):Observable<any> {
    return this.http.delete(`/api/planificare/deleteData/${uid}`)
  }
}
