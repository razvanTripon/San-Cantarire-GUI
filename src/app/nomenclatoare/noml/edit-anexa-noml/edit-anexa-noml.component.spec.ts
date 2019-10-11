import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnexaNomlComponent } from './edit-anexa-noml.component';

describe('EditAnexaNomlComponent', () => {
  let component: EditAnexaNomlComponent;
  let fixture: ComponentFixture<EditAnexaNomlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAnexaNomlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnexaNomlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
