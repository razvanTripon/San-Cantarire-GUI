import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PlanificareModel, DateFormat } from '../_models/planificare.model';
import { HelperService } from '../helper.service';
import { ServerPlanificareService } from '../server-planificare-service';

@Injectable()
export class PlanService {
    public data_ini: DateFormat = this.helper.getBootstrapDate(new Date());
    public filter = new BehaviorSubject<{ data_ini: DateFormat, data_fin: DateFormat }>({ data_ini: this.data_ini, data_fin: this.data_ini });
    public exportCSVGridPlanificare$ = new Subject<boolean>();

    public onOpenModal$ = new BehaviorSubject<PlanificareModel>(this.getPlanModel());
    public rowSelectedGridPlanificare$ = new BehaviorSubject<PlanificareModel>(null)

    constructor(
        private http: HttpClient,
        private helper: HelperService,
        private sD: ServerPlanificareService) {
    }

    onFilterPlanificare(data_ini: DateFormat, data_fin: any) {
        this.rowSelectedGridPlanificare$.next(null)
        data_fin = data_fin === "" || data_fin == null ? data_ini : data_fin;
        this.filter.next({
            data_ini: data_ini,
            data_fin: data_fin
        });
    }

    getRowsPlanificare(): Promise<any> {
        const data_ini = this.filter.value["data_ini"];
        const data_fin = this.filter.value["data_fin"];
        return this.http.get('/api/planificare/getPlans/' + this.helper.getJavascriptDate(data_ini) + '/' + this.helper.getJavascriptDate(data_fin)).toPromise()
    }

    onRowSelectGridPlanificare(rowData?) {
        const cloneRow = Object.assign({}, rowData)
        cloneRow["DATA_PLAN"] = this.helper.getBootstrapDate(new Date(cloneRow["DATA_PLAN"]))
        this.rowSelectedGridPlanificare$.next(cloneRow);
    }

    getPlanModel(): PlanificareModel {
        return {
            UID: this.helper.getUID(),
            PARENT: "",
            DATA_PLAN: this.data_ini,
            NR_PLAN: 0,
            DENUMIRE: "",
            POZITIE_TAMBUR: 0,
            COD_SORTIMENT: "",
            POZITIE_BOBINA: 0,
            COD_PRODUS: "",
            CLIENT: "",
            NR_COMANDA: "",
            CANT_PLANIFICAT: 0,
            TIP: "P"
        }
    }

    saveDataPlanificare(rowData: any, editMode: boolean): Promise<any> {
        rowData["DATA_PLAN"] = this.helper.getJavascriptDate(rowData["DATA_PLAN"])
        return this.sD.saveDataPlanificare(rowData, editMode ? "modify" : "add").toPromise()
    }

    reloadGridPlanificare() {
        this.filter.next({
            data_ini: this.filter.value["data_ini"],
            data_fin: this.filter.value["data_fin"]
        })
    }

    onDeleteRow() {
        let rowSel = this.rowSelectedGridPlanificare$.getValue();
        this.sD.deleteDataPlanificare(rowSel["UID"])
            .toPromise()
            .then(resp => {
                this.rowSelectedGridPlanificare$.next(null);
                this.reloadGridPlanificare();
            })
    }
    
}