import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditareTamburiComponent } from './editare-tamburi.component';

describe('EditareTamburiComponent', () => {
  let component: EditareTamburiComponent;
  let fixture: ComponentFixture<EditareTamburiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditareTamburiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditareTamburiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
