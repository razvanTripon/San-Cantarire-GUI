import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from '../_shared/alert/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navbarOpen = false;

  constructor(public auth: AuthenticationService, public router: Router, private alertService: AlertService) {

  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logOut() {
    this.auth.logout();
  }
  onClick() {
    let nivelAcces = 0;
    let lastLog = sessionStorage.getItem("loggedUser");
    if (lastLog) {
      let lastLoggin = JSON.parse(lastLog);
      nivelAcces = lastLoggin["nivelAcces"];
    }

    if (nivelAcces == 99)
      this.router.navigate(["usersManagement"])
    else
      this.alertService.emitAlert({ message: "Nivel de acces insuficient. Va rugam sa contactati administratorul de sistem", type: "danger", time: 15000 });
  }
}
