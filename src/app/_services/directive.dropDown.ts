import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDropDown]',
    exportAs: 'appDropDown'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    @HostListener('click') toggleopen() {
        this.isOpen = !this.isOpen;
    }
    @HostListener('window:click', ['$event.target']) onClick(targetElement: HTMLElement) {
        if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
            this.isOpen = false;
        }
    }
    constructor(private elementRef: ElementRef) {
    }
}