import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniuNomfComponent } from './meniu-nomf.component';

describe('MeniuNomfComponent', () => {
  let component: MeniuNomfComponent;
  let fixture: ComponentFixture<MeniuNomfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeniuNomfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeniuNomfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
