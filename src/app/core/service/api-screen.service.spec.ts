import { TestBed } from '@angular/core/testing';

import { ApiScreenService } from './api-screen.service';

describe('ApiScreenService', () => {
  let service: ApiScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
