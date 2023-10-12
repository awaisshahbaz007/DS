import { TestBed } from '@angular/core/testing';

import { ApiPlaylistService } from './api-playlist.service';

describe('ApiPlaylistService', () => {
  let service: ApiPlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
