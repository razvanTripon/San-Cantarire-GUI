import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { nompModel } from './nomp.model';

@Injectable({ providedIn: 'root' })
export class NompService {
    loadGridNomp$ = new Subject<boolean>();
    rowSelectedNomp$ = new BehaviorSubject<string>(null);
    scrollToCod$=new BehaviorSubject<string>(null);
    constructor(private http: HttpClient) {

    }
    getDateServerNomf(): Observable<any> {
        this.rowSelectedNomp$.next(null);
        return this.http.get('/api/nomp/getAllRows/')
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    return throwError(err.statusText + " " + err.status)
                })
            )
    }
    getPlanModel(): nompModel {
        return {
            CODP: "",
            TIPMAT: "",
            CPSA: "",
            DENUMIRE: "",
            UM: "",
            PAD: 0,
            MONEDA: "",
            PRET: "",
            TAXE: "",
            CODAUX: "",
            OBS: "",
            PAR: "SORT",
            PRETDEVIZ: 0,
            PRETRECOM: 0,
            GRAMAJ: 0,
            LATIME: 0,
            DIAM_INTERIOR: 0,
            DIAM_EXTERIOR: 0,
            CONT: "",
            CONC_ALCOOL: 0,
            GRAMAJ_BRUT: 0,
            CODURI: "",
            RETETAR: "",
            MARCA: ""
        }
    }
    getRowEditare(codp?: string): Promise<nompModel> {
        return new Promise(resolve => {
            if (codp) {
                this.http.get('api/nomp/getRow', { params: { codp: codp } }).toPromise().then(
                    (data: nompModel) => resolve(data)
                )
            } else {
                resolve(this.getPlanModel())
            }
        })
    }
    saveRow$(dataRow: nompModel, op: string): Promise<any> {
        return this.http.post('api/nomp/saveRow', dataRow, { params: { op } }).toPromise().then(
            (dataServer) => {
                return "ok";
            }
        )
    }
    deleteRow(cod: string) {
        this.http.get('api/nomp/deleteRow', { params: { cod: cod } }).toPromise()
            .then((dataServer) => {
                this.loadGridNomp$.next(true)
            })
            .catch(err => { console.log(err) })
    }
}