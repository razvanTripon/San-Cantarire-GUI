import { TestBed } from '@angular/core/testing';

import { NomlService } from './noml.service';

describe('NomlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NomlService = TestBed.get(NomlService);
    expect(service).toBeTruthy();
  });
});
