import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-close',
  templateUrl: './navbar-close.component.html',
  styleUrls: ['./navbar-close.component.scss']
})
export class NavbarCloseComponent implements OnInit {
  @Input() title:string 
  constructor() { }
  ngOnInit() {
  }

}
