import { Component, Output, EventEmitter, Input, forwardRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';

import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteService } from './autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    },
    AutoCompleteService]
})

export class AutocompleteComponent implements ControlValueAccessor, OnInit, Validator {
  @Output() getlabel = new EventEmitter<string>();
  @Input() url: string;
  @Input() placeHolder = ""
  @Input() mandatory = true;
  @ViewChild('inp', { static: true }) inp: ElementRef;
  validField = false;
  touched=false;

  constructor(private autoCompleteService: AutoCompleteService) {
  }

  ngOnInit() {
    this.inp.nativeElement.value = ""
  }
  checkClassValid(){
    if(this.touched){
      return this.validField;
    }
    return true;
  }
  touchedField(){
    this.touched=true;
  }
  validate(controler: AbstractControl): ValidationErrors | null {
    if (this.mandatory == false && controler.value != null) {
      this.validField = true;
      return null;
    }
    if (this.mandatory == true && controler.value != null && controler.value != "") {
      this.validField = true;
      return null;
    }
    this.validField=false;
    return { eroare: "invalid" };
  }

  writeValue(value: any) {
    if (typeof value === "object" && value.value != null) {
      this.inp.nativeElement.value = value.value
    } else {
      this.inp.nativeElement.value = value
    }
  }

  registerOnTouched() { }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  private propagateChange = (_: any) => { };

  search = (text$: Observable<string>) =>
    text$.pipe(
      tap((ev) => {
        if (ev.length == 0) this.propagateChange("");
        else this.propagateChange(null);
        this.getlabel.emit("");
      }),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term =>
        this.autoCompleteService.search(this.url, term).pipe(
          tap((ev) => {
            if (ev.length == 0 && term != "") this.propagateChange(null);
          }),
          catchError(() => {
            return of([]);
          }),
        )
      )
    )

  formatter = (x: { value: string }) => {
    return x.value;
  };

  onselect(ev: NgbTypeaheadSelectItemEvent) {
    this.getlabel.emit(ev.item.label);
    this.propagateChange(ev.item.value);
  }
}
