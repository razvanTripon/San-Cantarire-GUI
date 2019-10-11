import { TestBed } from '@angular/core/testing';

import { BobineService } from './bobine.service';

describe('BobineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BobineService = TestBed.get(BobineService);
    expect(service).toBeTruthy();
  });
});
