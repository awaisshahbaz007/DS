import { TestBed } from '@angular/core/testing';

import { DataTableServiceService } from './data-table-service.service';

describe('DataTableServiceService', () => {
  let service: DataTableServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTableServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
