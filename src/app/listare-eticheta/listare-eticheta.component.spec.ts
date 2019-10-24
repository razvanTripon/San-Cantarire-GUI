import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListareEtichetaComponent } from './listare-eticheta.component';

describe('ListareEtichetaComponent', () => {
  let component: ListareEtichetaComponent;
  let fixture: ComponentFixture<ListareEtichetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListareEtichetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListareEtichetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
