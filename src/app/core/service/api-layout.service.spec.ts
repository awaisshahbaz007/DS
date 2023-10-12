import { TestBed } from '@angular/core/testing';

import { ApiLayoutService } from './api-layout.service';

describe('ApiLayoutService', () => {
    let service: ApiLayoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ApiLayoutService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
