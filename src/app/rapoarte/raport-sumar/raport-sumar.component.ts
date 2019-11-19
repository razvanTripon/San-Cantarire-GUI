import { Component, OnInit } from '@angular/core';
import { FilterDateTimeService } from 'src/app/_shared/filter-date-time/filter-date-time.service';
import { RapoarteService } from '../rapoarte.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raport-sumar',
  template: ''
})
export class RaportSumarComponent implements OnInit {

  constructor(
    private filterDateFime:FilterDateTimeService,
    private raporteService:RapoarteService,
    private router:Router
    ) { }
  
  ngOnInit() {
    this.filterDateFime.getParams('Raport detaliat productie selectie perioada ').then(dataParams=>{
      if(dataParams){
        this.raporteService.downloadRepo("raportSumar",dataParams);
        this.router.navigate(['home']);
      } 
    })
  }


}
