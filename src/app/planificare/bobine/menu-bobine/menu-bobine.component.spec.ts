import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBobineComponent } from './menu-bobine.component';

describe('MenuBobineComponent', () => {
  let component: MenuBobineComponent;
  let fixture: ComponentFixture<MenuBobineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuBobineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBobineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
