import { TestBed } from '@angular/core/testing';

import { FacultiesService } from './faculties.service';

describe('FacultiesService', () => {
  let service: FacultiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
