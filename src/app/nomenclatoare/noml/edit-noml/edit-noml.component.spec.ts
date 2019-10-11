import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNomlComponent } from './edit-noml.component';

describe('EditNomlComponent', () => {
  let component: EditNomlComponent;
  let fixture: ComponentFixture<EditNomlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNomlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNomlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
