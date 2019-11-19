import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaPredareComponent } from './nota-predare.component';

describe('NotaPredareComponent', () => {
  let component: NotaPredareComponent;
  let fixture: ComponentFixture<NotaPredareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaPredareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaPredareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
