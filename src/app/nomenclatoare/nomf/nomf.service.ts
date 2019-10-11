import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { nomfModel } from './nomf.model';

@Injectable({ providedIn: 'root' })
export class NomfService {
    loadGridNomf$ = new Subject<boolean>();
    rowSelectedNomf$ = new BehaviorSubject<string>(null);
    constructor(private http: HttpClient) {

    }
    getDateServerNomf(): Observable<any> {
        this.rowSelectedNomf$.next(null);
        return this.http.get('/api/nomf/getAllRows/')
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    return throwError(err.statusText + " " + err.status)
                })
            )
    }
    getNomfModel(): nomfModel {
        return {
            COD: "",
            NUME: "",
            CODAUX: "",
            LOCALITATE: "",
            JUDET: "",
            OBS: "",
            STR: "",
            POSTAL: "",
            TEL: "",
            FAX: "",
            PAR: "",
            CAEN: "",
            STCEG: "",
            BRSCG: 0,
            VKBUR: "",
            VKGRP: "",
            KDGRP: "",
            KTGRD: "",
            NR: "",
            BLOC: "",
            SCARA: "",
            ETAJ: "",
            AP: "",
            SECTOR: "",
            UACCES: "",
            FOTOGRAFIE: "",
            TARA: "RO",
            TIP: "",
            ORC: "",
            CAPITAL_SOCIAL: 0,
            CF_PARINTE: "",
            EMAIL: "",
            BI: "",
            POLITIA: "",
            NIR: 0,
            CETATENIE: "",
            TIP_CI: "",
            TIP_AUTORIZ: "",
            DATA_IAU: "1900-01-01",
            DATA_SFA: "1900-01-01",
            OBS_FACT: "",
            CALITATE: "",
            WEB: ""
        }
    }
    getRowEditare(cod: string): Promise<nomfModel> {
        return new Promise(resolve => {
            if (cod != "") {
                this.http.get('api/nomf/getRow', { params: { cod: cod } }).toPromise()
                    .then(
                        (data: nomfModel) => {
                            resolve(data)
                        }
                    )
            } else {
                resolve(this.getNomfModel())
            }
        })
    }
    saveRow$(dataRow: nomfModel, op: string): Promise<any> {
        const row = Object.assign(this.getNomfModel(), dataRow);
        return this.http.post('api/nomf/saveRow', row, { params: { op } }).toPromise().then(
            (dataServer) => {
                return "ok";
            }
        )
    }
    deleteRow(cod: string) {
        this.http.get('api/nomf/deleteRow', { params: { cod: cod } }).toPromise()
            .then((dataServer) => {
                this.loadGridNomf$.next(true)
            })
            .catch(err => { console.log(err) })
    }
}