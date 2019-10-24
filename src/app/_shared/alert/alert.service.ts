import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
export interface AlertInterface {
    type: string,
    message: string,
    time?: number,
    size?: string
}

@Injectable({ providedIn: 'root' })
export class AlertService {
    subjectAlert$ = new Subject<AlertInterface>();
    subjectClear$ = new BehaviorSubject<boolean>(null);
    
    emitAlert(obj: AlertInterface) {
        this.subjectAlert$.next({
            type: obj.type,
            message: obj.message,
            time: obj.time || 5000,
            size: obj.size || "w-50"
        })
    }
    clearAllMessage(){
        this.subjectClear$.next(true);
    }
}