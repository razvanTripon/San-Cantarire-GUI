import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable, } from 'rxjs';
import { TamburiService } from '../tamburi.service';
import { PlanificareModel } from '../../_models/planificare.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdvanceSearchService } from 'src/app/_shared/advance-search/advance-search.service';
import { TypeAheadService } from 'src/app/_services/typeahead.service';
import { EditNompService } from 'src/app/nomenclatoare/nomp/edit-nomp/edit-nomp.service';

@Component({
  selector: 'app-editare-tamburi',
  templateUrl: './editare-tamburi.component.html',
  styleUrls: ['./editare-tamburi.component.scss']
})
export class EditareTamburiComponent implements OnInit, OnDestroy {
  @ViewChild("contentModal", { static: true }) contentModal;
  subscrOpenModal: Subscription;
  formOperare: FormGroup;
  submit = false;
  editMode: boolean;
  labelSortiment = "";
  searching = false;

  constructor(private fb: FormBuilder,
    private advanceSearchService: AdvanceSearchService,
    private editNompService:EditNompService,
    public typeAheadService: TypeAheadService,
    private tamburiService: TamburiService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.editMode = this.activeRoute.routeConfig.path === "editTambur" ? true : false
  }

  ngOnInit() {
    this.subscrOpenModal = this.tamburiService.onOpenModal$.subscribe(
      (data: PlanificareModel) => {
        //  console.log(data)
        this.labelSortiment = data.DENUMIRE;
        this.formOperare = this.fb.group({
          'UID': [data.UID],
          'PARENT': [data.PARENT, Validators.required],
          'DATA_PLAN': [data.DATA_PLAN],
          'NR_PLAN': [data.NR_PLAN],
          'DENUMIRE': [data.DENUMIRE],
          'POZITIE_TAMBUR': [{ value: data.POZITIE_TAMBUR, disabled: true }],
          'COD_SORTIMENT': [{ value: data.COD_SORTIMENT, label: this.labelSortiment }, this.typeAheadService.validatorTypeAhed],
          'POZITIE_BOBINA': [data.POZITIE_BOBINA],
          'COD_PRODUS': [data.COD_PRODUS],
          'CLIENT': [data.CLIENT],
          'NR_COMANDA': [data.NR_COMANDA],
          'CANT_PLANIFICAT': [data.CANT_PLANIFICAT],
          'TIP': [data.TIP]
        });
        setTimeout(() => {
          this.open();
        }, 100)
      }
    )

    this.activeRoute.queryParams.subscribe((params: Params) => {
      if (params["catalog"] == "nomp" && params["codp"] && params["denumire"] && params["codp"] != "") {
        this.formOperare.controls['COD_SORTIMENT'].setValue(params["codp"]);
        this.labelSortiment = params["denumire"];
      }
    })
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

  onAddSortiment() {
    this.editNompService.openEditare()
    .then(data=>{
      if(data){
        this.formOperare.controls['COD_SORTIMENT'].setValue({ value: data["CODP"], label: data["DENUMIRE"] });
        this.labelSortiment = data["DENUMIRE"];
      }
    })
    .catch(err=>{})
  }

  onAdvanceSearch(valField) {
    this.advanceSearchService
      .searchModal('searchOnlySortiment',valField ? valField : "") 
      .then((dataRow: any) => {
        if (dataRow) {
          this.formOperare.controls['COD_SORTIMENT'].setValue({ value: dataRow["CODP"], label: dataRow["DENUMIRE"] });
          this.labelSortiment = dataRow["DENUMIRE"];
        }
      })
      .catch(err => { console.log(err) })
  }
  onCancel() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    this.submit = true;
    if (this.formOperare.invalid) return;

    this.tamburiService.saveDataTamburi(this.formOperare.getRawValue(), this.editMode)
      .then(
        dataPlan => {
          this.tamburiService.reloadGridTamburi();
          this.modalService.dismissAll();
        })
      .catch(onError => {
        alert(onError)
      })
  }

  searchSortiment = (text$: Observable<string>) => {
    return this.typeAheadService.search(text$, "/api/autocomplete/nompOnlySortiment");
  }
  onselectSortiment(ev: NgbTypeaheadSelectItemEvent) {
    this.labelSortiment = ev.item.label;
  }
  ngOnDestroy() {
    this.subscrOpenModal.unsubscribe()
  }
}
