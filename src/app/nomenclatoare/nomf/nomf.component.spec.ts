import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomfComponent } from './nomf.component';

describe('NomfComponent', () => {
  let component: NomfComponent;
  let fixture: ComponentFixture<NomfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
