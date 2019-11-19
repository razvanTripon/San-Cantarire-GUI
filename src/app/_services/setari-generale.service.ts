import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetariGeneraleService {
  setariGenerale$=new BehaviorSubject<{}>(null);

  constructor(private http: HttpClient) {
    this.http.get('/api/getSetariGenerale').toPromise()
      .then(data => {
        this.setariGenerale$.next(data)
      })
      .catch(err => {
        this.setariGenerale$.next({});
      })
  }
  
}
