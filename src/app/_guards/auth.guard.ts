import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {
        return this.authService.isLoggedIn().pipe(
            map(e => {
                if (e) {
                    return true;
                } else {
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
            }),
            catchError((err) => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}