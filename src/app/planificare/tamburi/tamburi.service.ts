import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';

import { PlanificareModel } from '../_models/planificare.model';
import { HelperService } from '../helper.service';
import { map } from 'rxjs/operators';
import { ServerPlanificareService } from '../server-planificare-service';
import { PlanService } from '../planuri/planuri.service';

@Injectable()
export class TamburiService {
  parent: string;
  onOpenModal$ = new BehaviorSubject<PlanificareModel>(this.getTamburModel());
  rowSelectedGridTamburi$ = new BehaviorSubject<PlanificareModel>(null);
  public exportCSVGridPlanificare$ = new Subject<boolean>();
  tamburPosition = 1;

  constructor(private http: HttpClient,
    private helper: HelperService,
    private sD: ServerPlanificareService,
    private planService: PlanService) { }
  getTamburModel(): PlanificareModel {
    return {
      UID: this.helper.getUID(),
      PARENT: this.parent,
      DATA_PLAN: "1900-01-01",
      NR_PLAN: 0,
      DENUMIRE: "",
      POZITIE_TAMBUR: this.tamburPosition,
      COD_SORTIMENT: "",
      // COD_SORTIMENT: { value: "", label: "" },
      POZITIE_BOBINA: 0,
      COD_PRODUS: "",
      CLIENT: "",
      NR_COMANDA: "",
      CANT_PLANIFICAT: 0,
      TIP: "T"
    }
  }
  getDataServer$(parent: string): Observable<any> {
    this.parent = parent;
    this.rowSelectedGridTamburi$.next(null);

    if (parent != null)
      return this.http.get('/api/planificare/getTamburi/' + parent)
        .pipe(
          map((res: []) => {
            this.tamburPosition = res.length + 1;
            return res;
          })
        );
    else
      return of([])
  }
  saveAllTaburi(arr: PlanificareModel[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/planificare/setAllTamburi/', arr)
        .toPromise()
        .then(res => {
          resolve(res);
        })
    })
  }
  onRowSelectGridTamburi(rowData?) {
    const cloneRow = Object.assign({}, rowData);
    // cloneRow["COD_SORTIMENT"] = { label: cloneRow["DENUMIRE"], value: cloneRow["COD_SORTIMENT"] }
    this.rowSelectedGridTamburi$.next(cloneRow);
  }

  saveDataTamburi(rowData, editMode): Promise<any> {
    const cloneRow = Object.assign({}, rowData);
    cloneRow["COD_SORTIMENT"] = cloneRow["COD_SORTIMENT"]["value"];
    cloneRow["DENUMIRE"] = "";
    return this.sD.saveDataPlanificare(cloneRow, editMode ? "modify" : "add").toPromise()
  }

  reloadGridTamburi() {
    const rowSelectedPlanuri = this.planService.rowSelectedGridPlanificare$.getValue();
    this.planService.rowSelectedGridPlanificare$.next(rowSelectedPlanuri)
  }
  ondeleteTambur() {
    let rowSel = this.rowSelectedGridTamburi$.getValue();
    this.sD.deleteDataPlanificare(rowSel["UID"])
      .toPromise()
      .then(resp => {
        this.rowSelectedGridTamburi$.next(null);
        this.reloadGridTamburi();
      })
  }

}
