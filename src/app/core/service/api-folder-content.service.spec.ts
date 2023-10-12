import { TestBed } from '@angular/core/testing';

import { ApiFolderContentService } from './api-folder-content.service';

describe('ApiFolderContentService', () => {
  let service: ApiFolderContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFolderContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
