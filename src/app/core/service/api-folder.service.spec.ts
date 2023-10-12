import { TestBed } from '@angular/core/testing';

import { ApiFolderService } from './api-folder.service';

describe('ApiFolderService', () => {
  let service: ApiFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
