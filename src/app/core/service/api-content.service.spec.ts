import { TestBed } from '@angular/core/testing';

import { ApiContentService } from './api-content.service';

describe('ApiContentService', () => {
  let service: ApiContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
