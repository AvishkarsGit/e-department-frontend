import { TestBed } from '@angular/core/testing';

import { StudymaterialService } from './studymaterial.service';

describe('StudymaterialService', () => {
  let service: StudymaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudymaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
