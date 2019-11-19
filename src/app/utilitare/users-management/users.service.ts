import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HelperService } from 'src/app/_services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  loadGridUsers$ = new Subject<boolean>();
  rowSelectedUsers$ = new BehaviorSubject<string>(null);
  constructor(private http: HttpClient,private helperService:HelperService) {

  }
  getDateServerUsers(): Observable<any> {
    this.rowSelectedUsers$.next(null);
    return this.http.get('/api/Users/getAllRows/')
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.statusText + " " + err.status)
        })
      )
  }
  getUsersModel() {
    return {
      CODU: this.helperService.getUID(),
      GRUP: "",
      NUME: "",
      PASS: "",
      FACCES: 50,
      CFG: "",
      DREPT: "",
      TEL: "",
      EMAIL: "",
      CNP: "",
      CFGBI: "",
      NUME_PRENUME: "",
      CFD: ""
    }
  }
  getRowEditare(codu: string): Promise<any> {
    return new Promise(resolve => {
      if (codu != "") {
        this.http.get('api/Users/getRow', { params: { codu: codu } }).toPromise()
          .then(
            (data) => {
              resolve(data)
            }
          )
      } else {
        resolve(this.getUsersModel())
      }
    })
  }
  saveRow$(dataRow: any, op: string): Promise<any> {
    const row = Object.assign(this.getUsersModel(), dataRow);
    return this.http.post('api/Users/saveRow', row, { params: { op } }).toPromise().then(
      (dataServer) => {
        return "ok";
      }
    )
  }
  deleteRow(codu: string) {
    this.http.get('api/Users/deleteRow', { params: { codu: codu } }).toPromise()
      .then((dataServer) => {
        this.loadGridUsers$.next(true)
      })
      .catch(err => { console.log(err) })
  }
}
