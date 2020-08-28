import { TestBed } from '@angular/core/testing';

import { CustompreloadingService } from './custompreloading.service';

describe('CustompreloadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustompreloadingService = TestBed.get(CustompreloadingService);
    expect(service).toBeTruthy();
  });
});
