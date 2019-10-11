import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Injectable({ providedIn: "root" })
export class TypeAheadService {
    constructor(private http: HttpClient) {
    }
    public formatter = (x: { value: string }) => {
        return x.value;
    }
    public search(text$: Observable<string>, url: string, queryParams: {} = {}) {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term =>
                this.searchServer(term, url, queryParams).pipe(
                    catchError(() => {
                        return of([]);
                    }))
            )
        )
    }

    private searchServer(term: string, url: string, queryParams: {}) {
        if (term === '') {
            return of([]);
        }
        queryParams["search"] = term;
        return this.http.get(url, { params: queryParams })
    }

    validatorTypeAhed(controler: FormControl): { [s: string]: boolean } {
        if (typeof controler.value == "object" && controler.value) {
            if (controler.value.hasOwnProperty("value") && controler.value.value != "") return null;
        }
        return { err: true }
    }

}