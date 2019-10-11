import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '../_services/authentication.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../_shared/alert/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    subscription: Subscription;

    constructor(private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required])
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.subscription = this.authenticationService
            .login(
                this.loginForm.get('username').value,
                this.loginForm.get('password').value
            )
            .subscribe(
                (data: any) => {
                    if (data != "ok") {
                        this.alertService.emitAlert({ type: "danger", message: data, size: "w-50" })
                    }
                },
                (errMessage => {
                    this.alertService.emitAlert({ type: "danger", message: errMessage, size: "w-50" })
                })

            );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
