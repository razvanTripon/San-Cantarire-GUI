import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({providedIn:"root"})
export class AnexaNomlService{
    loadNomlAnexaGrid$=new BehaviorSubject<any>(null);
}