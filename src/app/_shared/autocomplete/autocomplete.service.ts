import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable()
export class AutoCompleteService {
  constructor(private http: HttpClient) { }
  search(url: string, term: string):Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get(url, { params: { 'search': term } })
  }
}
