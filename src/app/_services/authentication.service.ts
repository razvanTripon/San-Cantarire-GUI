import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public showHeader$ = new BehaviorSubject<boolean>(null);
    
    public currentUser$ = new BehaviorSubject<string>(null);
    public FACCES$ = new BehaviorSubject<number>(null);
    constructor(private http: HttpClient, private router: Router) { }
    login(username: string, password: string): Observable<any> {
        return this.http.get<any>('/api/authenticate', { params: { username, password } }).pipe(
            map(dataServer => {
                if (dataServer.auth) {
                    this.currentUser$.next(username);
                    this.FACCES$.next(dataServer["FACCES"]) 
                    this.setlocalStorage()
                    this.router.navigate(['home']);
                    this.showHeader$.next(true);
                    return "ok";
                }
                if (dataServer.errMessage) {
                    return dataServer.errMessage;
                }

            }),
            catchError(err => {
                console.log(err.message)
                return throwError(err.message);
            })
        )
    }
    getCurrentUserValue() {
        return this.currentUser$.getValue();
    }
    logout() {
        this.currentUser$.next(null);
        localStorage.removeItem("loggedUser");
        this.router.navigate(['login']);
    }
    setlocalStorage() {
        localStorage.setItem("loggedUser", JSON.stringify({ user: this.getCurrentUserValue(), lastLoggin: new Date(), nivelAcces: this.FACCES$.getValue()}));
    }
    isLoggedIn(): Observable<boolean> {
        let lastLog = localStorage.getItem("loggedUser");
        if (lastLog) {
            let lastLoggin = JSON.parse(lastLog);
            this.currentUser$.next(lastLoggin.user);
            this.FACCES$.next(lastLoggin.nivelAcces)
            let minutesDif = Math.round(new Date().getTime() - new Date(lastLoggin.lastLoggin).getTime() / 60000);
            // if (minutesDif <= 480) {
            this.setlocalStorage();
            this.showHeader$.next(true);
            return of(true);
            // }
        }
        if (this.currentUser$.value) {
            return of(true)
        }
        return of(false);
    }
}
