import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_shared/alert/alert.service';
import { BackupService } from './backup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {

  constructor(private alertService:AlertService,
     private backupService: BackupService,
     private router:Router) { }

  ngOnInit() {
    this.alertService.emitAlert( {type: "info",
      message: `A fost lansat serviciul de backup. La finalizarea salvarii si sincronizarii datelor in Cloud veti fi notificat. Salvarea dureaza aporximatim 1 minut.`,
      time: 8000,
      size: "w-50"})
      this.router.navigate(['home']);

      this.backupService.backupNow();
  }

}
