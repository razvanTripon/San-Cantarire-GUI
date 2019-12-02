import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CantarireService } from '../cantarire.service';
import { EditareCantarireProduseService } from './editare-produse/editare-produse.service';
import { RowNode } from 'ag-grid-community';
import { ConfirmationDialogService } from 'src/app/_shared/confirmation-dialog/confirmation-dialog.service';
import { AlertService } from 'src/app/_shared/alert/alert.service';
import { SseService } from '../sse.service';

let marjaDiametru=0;
@Component({
  selector: 'app-cantarire-grid-produse',
  templateUrl: './cantarire-grid-produse.component.html',
  styles: [`
    a{cursor: pointer;}
    .navbar { min-height:22px; border-radius:0} 
    .navbar .navbar-brand{ padding: 2px 8px;font-size: 14px;line-height: 14px; } 
    .navbar .navbar-nav > li > a { border-right:1px solid #ddd; padding-top: 2px; padding-bottom: 2px; line-height: 16px }`
  ]
})
export class CantarireGridProduseComponent implements OnDestroy {
  lastTambur = 0;
  formDetalii: FormGroup;
  menuDisabled = false;
  subscriptions = new Subscription();
  subscriptionServer: Subscription;
  rowNodeSelected: RowNode;
  serverSubscriptionExist = false;
  switchCantarire: any = { onColor: 'success', offColor: 'secondary', disabled: false, size: 'sm', value: false };
  switchListare: any = { onColor: 'success', offColor: 'secondary', disabled: false, size: 'sm', value: false };
  agGrid;
  rowData;
  columnDefs = [
    { headerName: 'UID', field: 'UID', hide: true },
    { headerName: 'TAMBUR', field: 'NR_TAMBUR', width: 130, type: "numericColumn" },
    { headerName: 'Bobina', field: 'NR_BOBINA', width: 130, type: "numericColumn" },
    { headerName: 'LATIME', field: 'LATIME', width: 130, type: "numericColumn", cellStyle: errStyle },
    { headerName: 'LUNGIME', field: 'LUNGIME', width: 130, type: "numericColumn", cellStyle: errStyle },
    { headerName: 'DIAMETRU INTERIOR', field: 'DIAM_INTERIOR', width: 150, type: "numericColumn", hide: true },
    { headerName: 'DIAMETRU PLANIFICAT', field: 'DIAM_EXTERIOR', width: 150, type: "numericColumn" },
    { headerName: 'DIAMETRU CITIT', field: 'DIAM_TRADUCTOR', width: 150, type: "numericColumn", cellClass: errDiam },
    { headerName: 'GREUTATE(kg)', field: 'GREUTATE', width: 130, type: "numericColumn", cellStyle: errStyle },

  ];

  constructor(
    private editareService: EditareCantarireProduseService,
    private cantarireService: CantarireService,
    private confirmationDialogService: ConfirmationDialogService,
    private alertService: AlertService,
    private sseService: SseService
  ) {

    const subsDisabled = this.cantarireService.cantarireAutomata$.subscribe(
      (disabled: boolean) => {
        if (disabled) {
          this.menuDisabled = true
        } else {
          this.menuDisabled = false
        }
      })
    this.subscriptions.add(subsDisabled);

    const sub1 = this.cantarireService.formDetalii$
      .subscribe(frm => {
        this.formDetalii = frm;
      })
    this.subscriptions.add(sub1);


    const sub2 = this.cantarireService.selectedBobina$.subscribe(data => {
      if (data == null) {
        this.switchCantarire["disabled"] = true;
        this.switchListare["disabled"] = true;
      } else {
        this.switchCantarire["disabled"] = false;
        this.switchListare["disabled"] = false;
      }
    })
    this.subscriptions.add(sub2);
    // const sub3 = this.cantarireService.selectedBobina$.subscribe(data => {
    //   if (data) this.rowData = this.cantarireService.getProduseCantarite();
    // });
    // this.subscriptions.add(sub3);

    const sub4 = this.cantarireService.loadDataGridProduse$.subscribe(data => {
      if (data == true) this.rowData = this.cantarireService.getProduseCantarite();
    });
    this.subscriptions.add(sub4);

    const sub5 = this.cantarireService.silentAddProduse$.subscribe(data => {
      if (data) {
        this.agGrid.updateRowData({ add: [data] });
        this.onRowDataChanged()

      }
    });
    this.subscriptions.add(sub5);

    const sub6 = this.cantarireService.silentEditProduse$.subscribe((data: {}) => {
      if (data && this.rowNodeSelected) {
        const dataS = this.rowNodeSelected.data
        for (const key in dataS) {
          if (data.hasOwnProperty(key)) {
            dataS[key] = data[key]
          }
        }
        this.agGrid.updateRowData({ update: [dataS] });
      }
    });
    this.subscriptions.add(sub6);
  }

  listareAutomata(ev: boolean) {
    this.cantarireService.listareAutomata$.next(ev)
  }

  cantarireAutomata(ev) {
    if(this.formDetalii.controls) marjaDiametru=this.formDetalii.controls["MARJA"].value;
    if (ev != null) {
      if (ev == true) {
        this.alertService.clearAllMessage();
        this.cantarireService.cantarireAutomata$.next(true);
        this.serverSubscriptionExist = true;
        this.subscriptionServer = this.sseService.getServerSentEvent('/api/traductori').subscribe(
          (traductoriData) => {
            if (traductoriData["err"]) {
              this.alertService.clearAllMessage();
              this.alertService.emitAlert({ message: traductoriData["err"], type: "danger", time: 6000000 });
              if(traductoriData["type"] && traductoriData["type"]=="stop"){
                this.switchCantarire.value = false;
                this.switchListare.value = false;
              }
              // else{

              // }
              // this.switchCantarire.value = false;
              // this.switchListare.value = false;
            }
            if (traductoriData["CANTITATE"]) {
              if (this.lastTambur != 0) {
                this.formDetalii.controls["TAMBUR"].setValue(this.lastTambur + 1);
                this.lastTambur = 0;
              }
              this.cantarireService.addRowCantarireAutomata(traductoriData["CANTITATE"]);

            }
            if (traductoriData["LUNGIMEA"]) {
              this.formDetalii.controls["LUNGIME"].setValue(traductoriData["LUNGIMEA"]);
              this.lastTambur = this.formDetalii.controls["TAMBUR"].value;
              //W             this.formDetalii.controls["TAMBUR"].setValue(maxTambur+1);
              //             this.formDetalii.getValue()).controls["TAMBUR"].setValue(data.MAXTAMBUR))
            }
            if (traductoriData["DIAMETRUL"]) this.formDetalii.controls["DIAMETRU"].setValue(traductoriData["DIAMETRUL"]);

          }
        );
        this.subscriptions.add(this.subscriptionServer);
      } else {
        if (this.serverSubscriptionExist) this.subscriptionServer.unsubscribe();
        this.cantarireService.cantarireAutomata$.next(false);
      }
    }
  }

  onEdit() {
    if(this.formDetalii.controls) marjaDiametru=this.formDetalii.controls["MARJA"].value;
    if (this.rowNodeSelected) {
      this.cantarireService.editareaRowCantarire((this.rowNodeSelected.data)["UID"]).then(data => {
        this.editareService.openEditare(data, "modify")
      })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onAdd() {//adaugare manuala
    if(this.formDetalii.controls) marjaDiametru=this.formDetalii.controls["MARJA"].value;
    if (this.cantarireService.selectedBobina$.getValue() != null) {
      this.cantarireService.addRowCantarire(0).then(data => {
        this.editareService.openEditare(data, "add")
      })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati o bobina", type: "danger" })
    }
  }

  onDelete() {
    if (this.rowNodeSelected) {
      this.confirmationDialogService
        .confirm('Va rugam sa confirmati..', 'Doriti sa stergeti randul selectat ?')
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.cantarireService.deleteProduseCantarite((this.rowNodeSelected.data)["UID"]).then((msg) => {
              this.agGrid.updateRowData({ remove: this.agGrid.getSelectedRows() });
              this.onRowDataChanged()
            });
          }
        })
        .catch(err => { })
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onViewEticheta() {
    if (this.rowNodeSelected) {
      this.cantarireService.viewEticheta((this.rowNodeSelected.data)["UID"])
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onPrintEticheta() {
    if (this.rowNodeSelected) {
      this.cantarireService.printEticheta((this.rowNodeSelected.data)["UID"])
    } else {
      this.alertService.emitAlert({ message: "Va rugam selectati un rand", type: "danger" })
    }
  }

  onRowDataChanged() {
    this.rowNodeSelected = null;
    let rowNodeLast;
    this.agGrid.forEachNode((rowNode: RowNode, index: number) => {
      rowNodeLast = rowNode
    })
    if (rowNodeLast) {
      rowNodeLast.setSelected(true);
      this.agGrid.ensureNodeVisible(rowNodeLast, 'bottom')
    }
  }
  onSelectionChanged() {
    this.agGrid.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.rowNodeSelected = rowNode;
    })
  }
  onGridReady(params) {
    this.agGrid = params.api;
    this.agGrid.hideOverlay();
  }
  ngOnDestroy() {
    this.cantarireService.cantarireAutomata$.next(null);
    this.subscriptions.unsubscribe();
  }
}

function errStyle(params) {
  if (Number(params.value) == 0) {
    return { color: 'red', 'font-weight': 'bold' };
  } else {
    return { color: 'black', 'font-weight': 'normal' };
  }
}

function errDiam(params) {
  const diamPlanificat = params["data"]["DIAM_EXTERIOR"];
  const diametruTraductor = params["data"]["DIAM_TRADUCTOR"];
  let limita_inf_Diametru = Number(diamPlanificat) - Number(marjaDiametru);
  if (limita_inf_Diametru < 0) limita_inf_Diametru = 0;
  const limita_sup_Diametru = Number(diamPlanificat) + Number(marjaDiametru);
  if (diametruTraductor >= limita_inf_Diametru && diametruTraductor <= limita_sup_Diametru) {
    return 'bg-transparent text-dark text-right';
  }
  return 'bg-danger text-white text-right';
}