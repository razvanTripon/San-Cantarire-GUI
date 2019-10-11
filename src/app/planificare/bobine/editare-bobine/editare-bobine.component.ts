import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BobineService } from '../bobine.service';
import { Subscription, Observable } from 'rxjs';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';

@Component({
  selector: 'app-editare-bobine',
  templateUrl: './editare-bobine.component.html',
  styleUrls: ['./editare-bobine.component.scss']
})
export class EditareBobineComponent implements OnInit, OnDestroy {
  @ViewChild("contentModal", { static: true }) contentModal;
  editMode: boolean;
  formOperare: FormGroup;
  submit = false;
  subscrOpenModal: Subscription;
  labelClient = "";
  labelComanda = "";
  labelProdus = "";
  subscrClient: Subscription;

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private bobineService: BobineService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private advanceSearchService: AdvanceSearchService,
    public typeAheadService: TypeAheadService
  ) {
    this.editMode = this.activeRoute.routeConfig.path === "editBobina" ? true : false
  }
  ngOnInit() {
    this.subscrOpenModal = this.bobineService.onOpenModal$.subscribe(
      (data: any) => {
        this.labelClient = data.DENUMIRE_CLIENT;
        this.labelProdus = data.DENUMIRE_PRODUS;
        this.labelComanda = data.DENUMIRE_NR_COMANDA;
        this.formOperare = this.fb.group({
          'UID': [data.UID],
          'PARENT': [data.PARENT, Validators.required],
          'DATA_PLAN': [data.DATA_PLAN],
          'NR_PLAN': [data.NR_PLAN],
          'DENUMIRE': [data.DENUMIRE],
          'POZITIE_BOBINA': [{ value: data.POZITIE_BOBINA, disabled: true }],
          'COD_SORTIMENT': [data.COD_SORTIMENT],
          'POZITIE_TAMBUR': [data.POZITIE_TAMBUR],
          'COD_PRODUS': [data.COD_PRODUS, Validators.required],
          'CLIENT': [{ value: data.CLIENT, label: this.labelClient }, this.typeAheadService.validatorTypeAhed],
          'NR_COMANDA': [data.NR_COMANDA, Validators.required],
          'CANT_PLANIFICAT': [data.CANT_PLANIFICAT, [Validators.min(0.1), Validators.required]],
          'TIP': [data.TIP]
        });

        this.subscrClient = this.formOperare.controls["CLIENT"].valueChanges.subscribe(val => {
          this.labelClient = ""
          this.resetComanda();
        })
      })
    setTimeout(() => {
      this.open();
    }, 100);
  }

  onAddProdus() {
    this.router.navigate(["addProdus"], { relativeTo: this.activeRoute })
  }
  open() {
    this.submit = false;
    this.modalService.open(this.contentModal, { size: 'lg' }).result
      .then(
        (result) => {
          this.router.navigate(["../"], { relativeTo: this.activeRoute })
        },
        (reason) => {
          this.router.navigate(["../"], { relativeTo: this.activeRoute })
        }
      )
  }
  onSubmit() {
    this.submit = true;
    if (this.formOperare.invalid) return;
    this.bobineService.saveDataBobine(this.formOperare.getRawValue(), this.editMode)
      .then(
        dataPlan => {
          this.bobineService.reloadGridBobine();
          this.modalService.dismissAll();
        })
      .catch(onError => {
        alert(onError)
      })
  }
  onCancel() {
    this.modalService.dismissAll();
  }
  ngOnDestroy() {
    this.subscrOpenModal.unsubscribe();
    this.subscrClient.unsubscribe();
  }

  getFormValue(field): string {
    if (field == "CLIENT") {
      const numevar = this.formOperare.get(field).value;
      if (numevar) {
        return numevar.hasOwnProperty("value") ? numevar["value"] : numevar;
      }
      return ""
    }
    return this.formOperare.get(field).value;
  }
  resetComanda() {
    this.formOperare.controls['NR_COMANDA'].setValue("");
    this.labelComanda = "";
  }
  resetProdus() {
    this.formOperare.controls['COD_PRODUS'].setValue("");
    this.labelProdus = "";
  }
  resetCant() {
    this.formOperare.controls['CANT_PLANIFICAT'].setValue(0);
  }

  searchClient = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nomf");
  }

  onselectClient(ev: NgbTypeaheadSelectItemEvent) {
    setTimeout(() => {
      this.labelClient = ev.item.label;
    }, 300)
  }

  onAdvanceSearchClient(valField) {
    this.advanceSearchService
      .searchModal('searchNomf', valField ? valField : "")
      .then((dataRow: any) => {
        if (dataRow) {
          if (this.getFormValue("CLIENT") != dataRow["COD"]) {
            this.resetComanda();
            this.resetProdus();
            this.resetCant();
          }
          this.formOperare.controls['CLIENT'].setValue({ value: dataRow["COD"], label: dataRow["NUME"] });
          this.labelClient = dataRow["NUME"];

        }
      })
      .catch(err => { })
  }

  onAdvanceSearchComanda(valField) {
    this.advanceSearchService
      .searchModal('searchNomlByClient', valField ? valField : "", { client: this.getFormValue("CLIENT") })
      .then((dataRow: any) => {
        if (dataRow) {
          if (this.getFormValue("NR_COMANDA") != dataRow["COD"]) {
            this.resetProdus();
            this.resetCant();
          }
          this.formOperare.controls['NR_COMANDA'].setValue(dataRow["COD"]);
          this.labelComanda = dataRow["NUME"];
        }
      })
      .catch(err => { console.log(err) })
  }


  onAdvanceSearchProdus(valField) {
    const selectedTambur = this.bobineService.getSelectedTambur();
    this.advanceSearchService
      .searchModal('searchProdusByTambur', valField ? valField : "", {
        codClient: this.getFormValue("CLIENT"),
        codSortiment: selectedTambur["COD_SORTIMENT"],
        codComanda: this.getFormValue("NR_COMANDA")
      })
      .then((dataRow: any) => {
        if (dataRow) {
          this.formOperare.controls['COD_PRODUS'].setValue(dataRow["PRODUS"]);
          this.labelProdus = dataRow["DEN_PROD"];
          this.formOperare.controls['CANT_PLANIFICAT'].setValue(dataRow["CANT"]);
        }
      })
      .catch(err => { console.log(err) })
  }

}
