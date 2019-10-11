import { Component } from '@angular/core';
import { PlanService } from './planuri/planuri.service';
import { TamburiService } from './tamburi/tamburi.service';
import { ServerPlanificareService } from './server-planificare-service';
import { BobineService } from './bobine/bobine.service';
@Component({
  selector: 'app-planificare',
  templateUrl: './planificare.component.html',
  providers: [PlanService, TamburiService, BobineService,  ServerPlanificareService]
})
export class PlanificareComponent {
  constructor() { }
}
