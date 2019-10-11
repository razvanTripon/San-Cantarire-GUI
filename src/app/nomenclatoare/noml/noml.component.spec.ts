import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomlComponent } from './noml.component';

describe('NomlComponent', () => {
  let component: NomlComponent;
  let fixture: ComponentFixture<NomlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
