import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { DepartmentService } from './department.service';


=======

import { DepartmentService } from './department.service';
>>>>>>> feature/department

describe('DepartmentServiceService', () => {
  let service: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
