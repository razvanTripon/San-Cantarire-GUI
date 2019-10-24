import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, AlertInterface } from './alert.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  subscriton: Subscription;
  subsClear:Subscription
  alerts: AlertInterface[] = []
  alertObj:AlertInterface={type:"",message:"",size:"w-50",time:5000}

  constructor(private alertService: AlertService) { }
  
  onClose(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
    //this.alerts=[];
  }
  ngOnInit() {
    this.subscriton = this.alertService.subjectAlert$.subscribe((data: AlertInterface) => {
      this.alertObj=data;
      this.alerts.push(data)
      setTimeout(() => this.alerts.shift(), data.time);
    })
    this.subsClear=this.alertService.subjectClear$.subscribe((flag)=>{
      if(flag==true){
        this.alerts=[];
      }
    })
  }
  ngOnDestroy() {
    this.subscriton.unsubscribe();
    this.subsClear.unsubscribe();
  }
}
