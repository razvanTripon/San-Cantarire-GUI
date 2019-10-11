import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { PlanificareModel } from '../_models/planificare.model';
import { HelperService } from '../helper.service';
import { ServerPlanificareService } from '../server-planificare-service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TamburiService } from '../tamburi/tamburi.service';

@Injectable()
export class BobineService {
  parent: string;
  bobinaPosition = 1;
  onOpenModal$ = new BehaviorSubject<PlanificareModel>(this.getBobinaModel());
  rowSelectedGridBobine$ = new BehaviorSubject<PlanificareModel>(null);
  public exportCSVGridBobine$ = new Subject<boolean>();

  constructor(private http: HttpClient,
    private helper: HelperService,
    private sD: ServerPlanificareService,
    private tamburiService: TamburiService) { }

  getBobinaModel(): PlanificareModel {
    return {
      UID: this.helper.getUID(),
      PARENT: this.parent,
      DATA_PLAN: "1900-01-01",
      NR_PLAN: 0,
      DENUMIRE: "",
      POZITIE_TAMBUR: this.bobinaPosition,
      COD_SORTIMENT: "",
      POZITIE_BOBINA: this.bobinaPosition,
      COD_PRODUS: "",
      CLIENT: "",
      NR_COMANDA: "",
      CANT_PLANIFICAT: 0,
      TIP: "B"
    }
  }
  getDataServer$(parent: string): Observable<any> {
    this.parent = parent;
    this.rowSelectedGridBobine$.next(null);
    this.onOpenModal$.next(this.getBobinaModel());
    if (parent != null)
      return this.http.get('/api/planificare/getBobine/' + parent)
        .pipe(
          map((res: []) => {
            this.bobinaPosition = res.length + 1;
            return res;
          })
        );
    else
      return of([])
  }
  saveAllBobine(arr: PlanificareModel[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/planificare/setAllBobine/', arr)
        .toPromise()
        .then(res => {
          resolve(res);
        })
    })
  }
  onRowSelectGridBobine(rowData?) {
    const cloneRow = Object.assign({}, rowData);
    this.rowSelectedGridBobine$.next(cloneRow);
  }

  saveDataBobine(rowData, editMode): Promise<any> {
    const cloneRow = Object.assign({}, rowData);
    // cloneRow["COD_SORTIMENT"] = cloneRow["COD_SORTIMENT"]["value"];
    cloneRow["DENUMIRE"] = "";
    cloneRow["CLIENT"] = cloneRow["CLIENT"].value ? cloneRow["CLIENT"].value : cloneRow["CLIENT"];
    cloneRow["COD_PRODUS"] = cloneRow["COD_PRODUS"].value ? cloneRow["COD_PRODUS"].value : cloneRow["COD_PRODUS"];
    cloneRow["NR_COMANDA"] = cloneRow["NR_COMANDA"].value ? cloneRow["NR_COMANDA"].value : cloneRow["NR_COMANDA"];
    return this.sD.saveDataPlanificare(cloneRow, editMode ? "modify" : "add").toPromise()
  }

  //   saveDataPlanificare(rowData: any, editMode: boolean): Promise<any> {
  //     rowData["DATA_PLAN"] = this.helper.getJavascriptDate(rowData["DATA_PLAN"])
  //     return this.sD.saveDataPlanificare(rowData, editMode ? "modify" : "add").toPromise()
  // }

  getSelectedTambur() {
    return this.tamburiService.rowSelectedGridTamburi$.getValue();
  }
  reloadGridBobine() {
    const rowSelectedPlanuri = this.getSelectedTambur();
    this.tamburiService.rowSelectedGridTamburi$.next(rowSelectedPlanuri)
  }
  ondeleteBobina() {
    let rowSel = this.rowSelectedGridBobine$.getValue();
    if (rowSel != null) {
      this.sD.deleteDataPlanificare(rowSel["UID"])
        .toPromise()
        .then(resp => {
          this.reloadGridBobine()
        })
    }
  }
}
