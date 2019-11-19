import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceSearchComponent } from './advance-search.component';

@Injectable()
export class AdvanceSearchService {
    // loadDataServer$ = new Subject();
    configDialog;

    configSearchNomp = {
        title: "Cautare produse",
        coldef: [
            { headerName: 'COD', field: 'CODP', sortable: true, width: 120 },
            { headerName: 'DENUMIRE', field: 'DENUMIRE', sortable: true, width: 250 },
            { headerName: 'TIP', field: 'TIPMAT', sortable: true, width: 60 },
            { headerName: 'SORTIMENT', field: 'PAR', sortable: true, width: 100 },
            { headerName: 'GRAMAJ', field: 'GRAMAJ', sortable: true, width: 100 },
            { headerName: 'LATIME', field: 'LATIME', sortable: true, width: 100 },
            { headerName: 'DIAM_INTERIOR', field: 'DIAM_INTERIOR', sortable: true, width: 140 },
            { headerName: 'DIAM_EXTERIOR', field: 'DIAM_EXTERIOR', sortable: true, width: 140 },
            { headerName: 'UM', field: 'UM', sortable: true, width: 80 }
        ],
        placeholderSearch: "Cautarea dupa cod sau denumire",
        gridSize: '250px',
        dialogSize: 'lg',
        api_server: "api/search/nomp",
        preloadRows: false
    }
    configSearchOnlySortiment = {
        title: "Cautare sortiment",
        coldef: [
            { headerName: 'Cod Sortiment', field: 'CODP', sortable: true, width: 150 },
            { headerName: 'Denumire', field: 'DENUMIRE', sortable: true, width: 280 },
            { headerName: 'Cod CEPI', field: 'CPSA', sortable: true, width: 150 }
        ],
        placeholderSearch: "Cautarea dupa cod sau denumire",
        gridSize: '250px',
        dialogSize: 'lg',
        api_server: "api/search/nompOnlySortiment",
        preloadRows: true
    }
    configSearchNomf = {
        title: "Cautare partener",
        coldef: [
            { headerName: 'CUI', field: 'COD', sortable: true, width: 100 },
            { headerName: 'NUME', field: 'NUME', sortable: true, width: 250 },
            { headerName: 'LOCALITATE', field: 'LOCALITATE', sortable: true, width: 200 },
            { headerName: 'STR', field: 'STR', sortable: true, width: 150 },
            { headerName: 'NR', field: 'NR', sortable: true, width: 90 },
            { headerName: 'BLOC', field: 'BLOC', sortable: true, width: 90 },
            { headerName: 'SCARA', field: 'SCARA', sortable: true, width: 90 },
            { headerName: 'ETAJ', field: 'ETAJ', sortable: true, width: 90 },
            { headerName: 'AP', field: 'AP', sortable: true, width: 90 },
            { headerName: 'JUDET', field: 'JUDET', sortable: true, width: 120 },
            { headerName: 'TARA', field: 'TARA', sortable: true, width: 80 },
        ],
        placeholderSearch: "Cautarea dupa CUI sau denumire partener comercial",
        gridSize: '250px',
        dialogSize: 'lg',
        api_server: "api/search/nomf",
        preloadRows: false
    }
    configSearchBobina = {
        title: "Cautare bobina",
        coldef: [
            { headerName: 'Data', field: 'DATA_LST', sortable: true, width: 95 },
            { headerName: 'Bobina', field: 'NR_BOBINA', sortable: true, width: 70 },
            { headerName: 'Sortiment', field: 'DEN_SORT', sortable: true, width: 100 },
            { headerName: 'Cod CEPI', field: 'COD_CEPI', sortable: true, width: 80 },
            { headerName: 'Gramaj', field: 'GRAMAJ', sortable: true, width: 70 },
            { headerName: 'Latime', field: 'LATIME', sortable: true, width: 70 },
            { headerName: 'Lungime', field: 'LUNGIME', sortable: true, width: 80 },
            { headerName: 'Greutate', field: 'GREUTATE', sortable: true, width: 80 },
            { headerName: 'Ø int', field: 'DIAM_INTERIOR', sortable: true, width: 70 },
            { headerName: 'Ø ext', field: 'DIAM_EXTERIOR', sortable: true, width: 70 }
        ],
        placeholderSearch: "Cautarea bobina",
        gridSize: '250px',
        dialogSize: 'lg',
        api_server: "api/search/bobina",
        preloadRows: false
    }


    constructor(private modalService: NgbModal) {
    }

    public searchModal(type: string, searchInitialValue = "", queryParams = {}): Promise<boolean> {
        if (type == "searchNomp") this.configDialog = this.configSearchNomp;
        if (type == "searchOnlySortiment") this.configDialog = this.configSearchOnlySortiment;

        if (type == "searchNomf") this.configDialog = this.configSearchNomf;
        if (type == "searchBobina") this.configDialog = this.configSearchBobina;
        if (type == "searchNompSortiment") {
            const configSearchSortiment = Object.assign({}, this.configSearchNomp);
            configSearchSortiment["title"] = "Cautare sortiment produse";
            this.configDialog = configSearchSortiment;
        }
        this.configDialog.searchInitialValue = searchInitialValue;
        this.configDialog.queryParams = queryParams;
        const modalRef = this.modalService.open(AdvanceSearchComponent, { size: this.configDialog.dialogSize });
        modalRef.componentInstance.configDialog = this.configDialog;
        return modalRef.result;
    }
}
