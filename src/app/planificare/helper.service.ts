import { Injectable } from '@angular/core';

import { DateFormat } from './_models/planificare.model';

@Injectable({providedIn:'root'})
export class HelperService {
    getUID(): string {
        return (Math.random() + (new Date).getTime() / 10000000000000).toString(36).substr(2, 10);
    }
    getJavascriptDate(dataObj: DateFormat): string {
        const dd = dataObj.day < 10 ? `0${dataObj.day}` : dataObj.day;
        const mm = dataObj.month < 10 ? `0${dataObj.month}` : dataObj.month;
        return `${dataObj.year}-${mm}-${dd}`;
    }
    getBootstrapDate(data: Date): DateFormat {
        return { year: data.getFullYear(), month: data.getMonth() + 1, day: data.getDate() }
    }
}