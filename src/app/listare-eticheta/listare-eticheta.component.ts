import { Component, OnInit } from '@angular/core';
import { OwListareService } from './open-window/ow-listare.service';

@Component({
  selector: 'app-listare-eticheta',
  templateUrl: './listare-eticheta.component.html',
  styleUrls: ['./listare-eticheta.component.scss']
})
export class ListareEtichetaComponent implements OnInit {

  constructor(private owListare:OwListareService) { }

  ngOnInit() {
    this.owListare.openEditare()
  }

}
