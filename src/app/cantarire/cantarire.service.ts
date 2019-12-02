import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HelperService } from 'src/app/_services/helper.service';
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
            'DIAMETRU': [0],
            'MARJA': [30]
        })
    )
    updateGridComenzi$ = new BehaviorSubject<boolean>(null);

    loadDataGridProduse$ = new BehaviorSubject<boolean>(null);
    loadDataGridComenzi$ = new BehaviorSubject<boolean>(null);

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

    getProduseCantarite(): Promise<[]> {
        const reel = this.selectedBobina$.getValue();
        if (reel == null) return new Promise(resolve => { resolve([]) })
        return this.getServer('/api/cantarire/getProduseCantarite', { uid: reel["UIDGENERAL"] })
    }
    setFormDetalii(controlerName: string, value: any) {
        (this.formDetalii$.getValue()).controls[controlerName].setValue(value);
    }
    private getMaxTambur(): void {
        this.getServer('/api/cantarire/getMaxTambur')
            .then((data: { MAXTAMBUR: number, MARJA: number }) => {
                this.setFormDetalii("TAMBUR", data.MAXTAMBUR);
                this.setFormDetalii("MARJA", data.MARJA);
            })
            .catch(err => {
                this.setFormDetalii("TAMBUR", 0);
            })
    }

    getCodOPerator(): string {
        let lastLog = localStorage.getItem("loggedUser");
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

    addRowCantarire(greutatea: number): Promise<any> {
        return new Promise(resolve => {
            const row = {
                UID: this.helper.getUID(),
                TAMBUR: (this.selectedBobina$.getValue())["UID"],
                BOBINA: (this.selectedBobina$.getValue())["UIDGENERAL"],
                COD_SORT: (this.selectedBobina$.getValue())["COD_SORT"],
                DEN_SORT: (this.selectedBobina$.getValue())["DEN_SORT"],
                COD_CEPI: (this.selectedBobina$.getValue())["COD_CEPI"],
                GRAMAJ: (this.selectedBobina$.getValue())["REELSUBST"],
                CLIENT: (this.selectedBobina$.getValue())["REELCLIENT"],
                DEN_CLIENT: (this.selectedBobina$.getValue())["DEN_CLIENT"],
                NR_TAMBUR: (this.formDetalii$.getValue()).controls["TAMBUR"].value,
                NR_BOBINA: 0,
                TURA: "",
                LATIME: (this.selectedBobina$.getValue())["REELWIDTH"],
                LUNGIME: (this.formDetalii$.getValue()).controls["LUNGIME"].value,
                DIAM_INTERIOR: (this.selectedBobina$.getValue())["DIAM_INT"],
                DIAM_EXTERIOR: (this.selectedBobina$.getValue())["DIAM_EXT"],
                DIAM_TRADUCTOR: Number((this.formDetalii$.getValue()).controls["DIAMETRU"].value),
                GREUTATE: greutatea,
                DATA: "1900-01-01",
                CODOP: this.getCodOPerator()
            }
            this.getNewCantarireData().then(
                (dataCantarire: { MAXBOBINA: number }) => {
                    row["NR_BOBINA"] = dataCantarire["MAXBOBINA"]
                    resolve(row)
                })
                .catch(ev => resolve(null))

        })
    }

    editareaRowCantarire(uidRow: string): Promise<{ UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, LABEL_CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, CODOP: string }> {
        return this.getServer('/api/cantarire/editareaRowCantarire', { uid: uidRow })
    }

    getNewCantarireData(): Promise<{}> {
        return this.getServer('/api/cantarire/getNewCantarireData')
    }

    saveRowCantarire(data: { UID: string, PLAN: string, TAMBUR: string, BOBINA: string, COD_PRODUS: string, CLIENT: string, NR_COMANDA: string, NR_TAMBUR: number, NR_BOBINA: number, TURA: string, LATIME: number, LUNGIME: number, DIAM_INTERIOR: number, DIAM_EXTERIOR: number, GREUTATE: number, DATA: string, CODOP: string }, operatie: "add" | "modify"): Promise<string> {
        const cloneRow = Object.assign({}, data)
        cloneRow["operatie"] = operatie;

        if (cloneRow.hasOwnProperty("TAMBUR")) this.setFormDetalii("TAMBUR", cloneRow["NR_TAMBUR"]);
        // if (typeof cloneRow["CLIENT"] == 'object' && cloneRow["CLIENT"] != null) cloneRow["CLIENT"] = cloneRow["CLIENT"]["value"];
        return this.getServer('/api/cantarire/saveRowCantarire', cloneRow)
            .then((dataServer) => {
                if (dataServer && dataServer.hasOwnProperty("salvare")) {
                    if (operatie == "add") {
                        if (this.listareAutomata$.getValue() == true) this.printEticheta(data["UID"])
                        this.selectNextBobina$.next(dataServer);
                        this.silentAddProduse$.next(cloneRow);
                    }
                    if (operatie == "modify") {
                        this.silentEditProduse$.next(cloneRow);
                        this.updateGridComenzi$.next(true)
                    }
                }
                return dataServer
            })
            .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
    }

    deleteProduseCantarite(uid: string): Promise<{}> {
        return this.getServer('/api/cantarire/deleteProduseCantarite', { uid: uid })
            .then(dataServer => {
                this.updateGridComenzi$.next(true)
                return dataServer;
            })
    }

    resetGrids() {
        this.selectedBobina$.next(null);
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

    getPrinters() {
        return this.getServer('/api/cantarire/getPrinters');
    }

    setSetariListare(data) {
        return this.getServer('/api/cantarire/setSetariListare', data);
    }

    adaugareComanda() {
        return {
            UID: this.helper.getUID(),
            DATA: "1900-01-01",
            formReelGroup: {
                formReel_1: {
                    REELSORT_1: { value: "", label: "" },
                    REELDEN_1: "",
                    REELCEPI_1:"",
                    REELWIDTH_1: 0,
                    REELSUBST_1: 0,
                    REELCLIENT_1: "",
                    LABEL_CLIENT_1: ""
                },
                formReel_2: {
                    REELSORT_2: { value: "", label: "" },
                    REELDEN_2: "",
                    REELCEPI_2:"",
                    REELWIDTH_2: 0,
                    REELSUBST_2: 0,
                    REELCLIENT_2: "",
                    LABEL_CLIENT_2: ""
                },
                formReel_3: {
                    REELSORT_3: { value: "", label: "" },
                    REELDEN_3: "",
                    REELCEPI_3:"",
                    REELWIDTH_3: 0,
                    REELSUBST_3: 0,
                    REELCLIENT_3: "",
                    LABEL_CLIENT_3: ""
                },
                formReel_4: {
                    REELSORT_4: { value: "", label: "" },
                    REELDEN_4: "",
                    REELCEPI_4:"",
                    REELWIDTH_4: 0,
                    REELSUBST_4: 0,
                    REELCLIENT_4: "",
                    LABEL_CLIENT_4: ""
                }
            },
            CANTITATE: 0,
            DIAM_INT: 0,
            DIAM_EXT: 0
        }
    }
    editComanda() {
        return this.getServer('/api/planificare/editComanda');
    }
    saveComanda(
        data: {
            UID: string,
            DATA: string,

            REELSORT_1: string,
            REELCEPI_1: string,
            REELWIDTH_1: number,
            REELSUBST_1: number,
            REELDEN_1: number,
            REELCLIENT_1: string,
            REELSORT_2: string,
            REELCEPI_2: string,
            REELWIDTH_2: number,
            REELSUBST_2: number,
            REELDEN_2: number,
            REELCLIENT_2: string,
            REELSORT_3: string,
            REELCEPI_3: string,
            REELWIDTH_3: number,
            REELSUBST_3: number,
            REELDEN_3: number,
            REELCLIENT_3: string,
            REELSORT_4: string,
            REELCEPI_4: string,
            REELWIDTH_4: number,
            REELSUBST_4: number,
            REELDEN_4: number,
            REELCLIENT_4: string,
            CANTITATE: number,
            DIAM_INT: number,
            DIAM_EXT: number
        }, operatie: "add" | "modify"): Promise<string> {
        const cloneRow = Object.assign({}, data)
        cloneRow["operatie"] = operatie;
        if (typeof cloneRow["REELCLIENT_1"] == 'object' && cloneRow["REELCLIENT_1"] != null) cloneRow["REELCLIENT_1"] = cloneRow["REELCLIENT_1"]["value"];
        if (typeof cloneRow["REELCLIENT_2"] == 'object' && cloneRow["REELCLIENT_2"] != null) cloneRow["REELCLIENT_2"] = cloneRow["REELCLIENT_2"]["value"];
        if (typeof cloneRow["REELCLIENT_3"] == 'object' && cloneRow["REELCLIENT_3"] != null) cloneRow["REELCLIENT_3"] = cloneRow["REELCLIENT_3"]["value"];
        if (typeof cloneRow["REELCLIENT_4"] == 'object' && cloneRow["REELCLIENT_4"] != null) cloneRow["REELCLIENT_4"] = cloneRow["REELCLIENT_4"]["value"];
        if (typeof cloneRow["REELSORT_1"] == 'object' && cloneRow["REELSORT_1"] != null) cloneRow["REELSORT_1"] = cloneRow["REELSORT_1"]["value"];
        if (typeof cloneRow["REELSORT_2"] == 'object' && cloneRow["REELSORT_2"] != null) cloneRow["REELSORT_2"] = cloneRow["REELSORT_2"]["value"];
        if (typeof cloneRow["REELSORT_3"] == 'object' && cloneRow["REELSORT_3"] != null) cloneRow["REELSORT_3"] = cloneRow["REELSORT_3"]["value"];
        if (typeof cloneRow["REELSORT_4"] == 'object' && cloneRow["REELSORT_4"] != null) cloneRow["REELSORT_4"] = cloneRow["REELSORT_4"]["value"];

        return this.getServer('/api/planificare/saveComanda', cloneRow)
            .then((dataServer) => {
                this.loadDataGridComenzi$.next(true);
                return dataServer
            })
            .catch((err: any) => { this.alertService.emitAlert({ type: "danger", message: err.message ? err.message : err, size: "w-50" }) });
    }
    gridComanda() {
        return this.getServer('/api/planificare/gridComanda')
    }

}