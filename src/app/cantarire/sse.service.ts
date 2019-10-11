import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private _zone: NgZone) { }

  getServerSentEvent(url: string) {
    return Observable.create(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = (event: MessageEvent) => {
        this._zone.run(() => {
          if (event["data"]) {
            observer.next(JSON.parse(event.data));
          }
        })
      }
      eventSource.onerror=error=>{
        this._zone.run(()=>{
          console.log("eroare conexiune server")
//          eventSource.close();
//          observer.error(error);
        })
      }
      return () => eventSource.close(); //se reconecteaza automat in caz de deconectare in 3 sec(default)
    })
  }
}
