import { TestBed } from '@angular/core/testing';

import { ApiScheduleService } from './api-schedule.service';

describe('ApiScheduleService', () => {
  let service: ApiScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
