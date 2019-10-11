import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniuNomlComponent } from './meniu-noml.component';

describe('MeniuNomlComponent', () => {
  let component: MeniuNomlComponent;
  let fixture: ComponentFixture<MeniuNomlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeniuNomlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeniuNomlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
