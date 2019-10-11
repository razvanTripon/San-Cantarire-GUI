import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNompComponent } from './edit-nomp.component';

describe('EditNompComponent', () => {
  let component: EditNompComponent;
  let fixture: ComponentFixture<EditNompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
