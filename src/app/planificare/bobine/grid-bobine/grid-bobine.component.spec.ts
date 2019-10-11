import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBobineComponent } from './grid-bobine.component';

describe('GridBobineComponent', () => {
  let component: GridBobineComponent;
  let fixture: ComponentFixture<GridBobineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridBobineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBobineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
