
import { Component, OnInit } from '@angular/core';
import { CantarireService } from './cantarire.service';




@Component({
  selector: 'app-cantarire',
  templateUrl: './cantarire.component.html',
  styleUrls: ['./cantarire.component.scss']
})
export class CantarireComponent implements OnInit {
  constructor(private cantarireService:CantarireService) {
    this.cantarireService.resetGrids();
  }

  ngOnInit() {

  }

}