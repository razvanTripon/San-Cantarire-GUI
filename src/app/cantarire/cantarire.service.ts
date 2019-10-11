import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HelperService } from 'src/app/planificare/helper.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: "root" })
export class CantarireService {
    formDetalii$: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(
        this.fb.group({
            'TAMBUR': [15],
            'LUNGIME': [0],
            'DIAMETRU': [0]
        })
    )

    loadDataGridProduse$ = new BehaviorSubject<boolean>(null);

    selectedPlan$ = new BehaviorSubject<string>(null);
    selectedTambur$ = new BehaviorSubject<Object>(null);
    selectedBobina$ = new BehaviorSubject<Object>(null);
    cantarireAutomata$ = new BehaviorSubject<boolean>(false);
    listareAutomata$ = new BehaviorSubject<boolean>(false);
    selectNextBobina$ = new BehaviorSubject<Object>(null);
    silentAddProduse$ = new Subject<Object>();
    silentEditProduse$ = new BehaviorSubject<Object>(null);
    silentdeleteProduse$ = new BehaviorSubject<Object>(null);

    constructor(
        private fb: FormBuilder,
        private helper: HelperService,
        private http: HttpClient,
        private alertService: AlertService
    ) {
        this.getMaxTambur();
    }

    getServer(url, params: {} = {}): Promise<any> {
        return this.http.get(url, { params: params }).toPromise()
            .then(data => {
                if (data["errMessage"]) {
                    throw Error(data["errMessage"]);
                }
                return data
            })
            .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
    }

    getPlanuriByDay(data: { year: number, day: number, month: number }): Promise<[]> {
        return this.getServer('/api/cantarire/getPlanuriByDay', { data: this.helper.getJavascriptDate(data) })
    }

    getTamburiByPlan(uidPlan: string): Promise<[]> {
        if (uidPlan == null) return new Promise(resolve => { resolve([]) });
        return this.getServer('/api/cantarire/getTamburiByPlan', { uid: uidPlan })
    }

    getBobineByTambur(): Promise<[]> {
        const tambur = this.selectedTambur$.getValue();
        if (tambur == null) return new Promise(resolve => { resolve([]) })
        return this.getServer('/api/cantarire/getBobineByTambur', { uid: tambur["UID"] })
    }

    getProduseCantarite(): Promise<[]> {
        const tambur = this.selectedTambur$.getValue();
        if (tambur == null) return new Promise(resolve => { resolve([]) })
        return this.getServer('/api/cantarire/getProduseCantarite', { uid: tambur["UID"] })
    }

    private getMaxTambur(): void {
        this.getServer('/api/cantarire/getMaxTambur')
            .then((data: { MAXTAMBUR: number }) => (this.formDetalii$.getValue()).controls["TAMBUR"].setValue(data.MAXTAMBUR))
            .catch(err => { (this.formDetalii$.getValue()).controls["TAMBUR"].setValue(0) })
    }

    getDataOperarii(): string {
        return new Date().toISOString().slice(0, 10);
    }

    private format_two_digits(n) {
        return n < 10 ? '0' + n : n;
    }

    getTimpulOperarii(): string {
        const d = new Date();
        const hours = this.format_two_digits(d.getHours());
        const minutes = this.format_two_digits(d.getMinutes());
        const seconds = this.format_two_digits(d.getSeconds());
        return hours + ":" + minutes + ":" + seconds;
    }

    getCodOPerator(): string {
        let lastLog = sessionStorage.getItem("loggedUser");
        if (lastLog) {
            let lastLoggin = JSON.parse(lastLog);
            return lastLoggin["user"]
        }
        return null;
    }

    addRowCantarireAutomata(greutate: number) {
        this.addRowCantarire(greutate).then(data => {
            //        console.log(data)
            this.saveRowCantarire(data, "add");
        })
    }

    addRowCantarire(greutatea: number): Promise<{ UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, LABEL_CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, TIME_OP: string, CODOP: string }> {
        return new Promise(resolve => {
            const cod_produs = (this.selectedBobina$.getValue())["COD_PRODUS"];
            this.getNewCantarireData(cod_produs).then(
                (dataCantarire: { MAXBOBINA: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, TURA: string, MARJA_DIAMETRU: number }) => {
                    // console.log(this.selectedBobina$.getValue())
                    const limita_inf_Diametru=Number(dataCantarire["DIAM_EXTERIOR"])-Number(dataCantarire["MARJA_DIAMETRU"])
                    const limita_sup_Diametru=Number(dataCantarire["DIAM_EXTERIOR"])+Number(dataCantarire["MARJA_DIAMETRU"])
                    const diametruTraductor=Number((this.formDetalii$.getValue()).controls["DIAMETRU"].value);
                    let diametruOperat=0;
                    if(diametruTraductor>=limita_inf_Diametru && diametruTraductor<=limita_sup_Diametru) diametruOperat=dataCantarire["DIAM_EXTERIOR"]
                    if(diametruTraductor==0) diametruOperat=dataCantarire["DIAM_EXTERIOR"]
                   // let diam_ext = (this.formDetalii$.getValue()).controls["DIAMETRU"].value;
                   // if (diam_ext == "0" || diam_ext == 0) diam_ext = dataCantarire.DIAM_EXTERIOR
                    const row = {
                        UID: this.helper.getUID(),
                        PLAN: this.selectedPlan$.getValue(),
                        TAMBUR: (this.selectedTambur$.getValue())["UID"],
                        BOBINA: (this.selectedBobina$.getValue())["UID"],
                        COD_PRODUS: (this.selectedBobina$.getValue())["COD_PRODUS"],
                        CLIENT: (this.selectedBobina$.getValue())["COD_CLIENT"],
                        LABEL_CLIENT: (this.selectedBobina$.getValue())["LABEL_CLIENT"],
                        NR_COMANDA: (this.selectedBobina$.getValue())["NR_COMANDA"],
                        NR_TAMBUR: (this.formDetalii$.getValue()).controls["TAMBUR"].value,
                        NR_BOBINA: dataCantarire["MAXBOBINA"],
                        TURA: dataCantarire["TURA"],
                        LATIME: (this.selectedBobina$.getValue())["LATIME"],
                        LUNGIME: (this.formDetalii$.getValue()).controls["LUNGIME"].value,
                        DIAM_INTERIOR: dataCantarire["DIAM_INTERIOR"],
                        DIAM_EXTERIOR: diametruOperat,
                        GREUTATE: greutatea,
                        DATA: this.getDataOperarii(),
                        TIME_OP: this.getTimpulOperarii(),
                        CODOP: this.getCodOPerator()
                    }
                    resolve(row)
                })
                .catch(ev => resolve(null))
        })
    }

    editareaRowCantarire(uidRow: string): Promise<{ UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, LABEL_CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, TIME_OP: string, CODOP: string }> {
        return this.getServer('/api/cantarire/editareaRowCantarire', { uid: uidRow })
    }

    getNewCantarireData(codProdus: string): Promise<{}> {
        return this.getServer('/api/cantarire/getNewCantarireData', { codProdus: codProdus })
    }

    saveRowCantarire(data: { UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, TIME_OP: string, CODOP: string }, operatie: "add" | "modify"): Promise<string> {
        const cloneRow = Object.assign({}, data)
        cloneRow["operatie"] = operatie;
        if (typeof cloneRow["CLIENT"] == 'object' && cloneRow["CLIENT"] != null) cloneRow["CLIENT"] = cloneRow["CLIENT"]["value"];
        return this.getServer('/api/cantarire/saveRowCantarire', cloneRow)
            .then((dataServer) => {
                if (operatie == "add" && dataServer && dataServer.hasOwnProperty("salvare")) {
                    if (this.listareAutomata$.getValue() == true) this.printEticheta(data["UID"])
                    this.selectNextBobina$.next(dataServer)
                }
                this.getMaxTambur();
                if (operatie == "add") this.silentAddProduse$.next(cloneRow);
                if (operatie == "modify") this.silentEditProduse$.next(cloneRow);
                return dataServer
            })
            .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
    }

    deleteProduseCantarite(uid: string): Promise<{}> {
        return this.getServer('/api/cantarire/deleteProduseCantarite', { uid: uid })
    }

    resetGrids() {
        this.selectedPlan$.next(null);
        this.selectedBobina$.next(null);
        this.selectedTambur$.next(null);
    }

    viewEticheta(uid: string): void {
        let headerOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        });
        let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob', params: { uid } };
        this.http.get('/api/viewEticheta', requestOptions).pipe(map((data: any) => {
            let blob = new Blob([data], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Eticheta.pdf';
            link.click();
            window.URL.revokeObjectURL(link.href);
        })).toPromise();
    }

    printEticheta(uid: string) {
        return this.getServer('/api/printEticheta', { uid: uid });
    }

    getSetariListare() {
        return this.getServer('/api/cantarire/getSetariListare');
    }

    setSetariListare(data) {
        return this.getServer('/api/cantarire/setSetariListare', data);
    }

    getMarjaDiametru() {
        return this.getServer('/api/cantarire/getMarjaDiametru')
    }
}