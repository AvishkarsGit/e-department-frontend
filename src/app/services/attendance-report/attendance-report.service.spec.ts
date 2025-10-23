import { TestBed } from '@angular/core/testing';

import { AttendanceReportService } from './attendance-report.service';

describe('AttendanceReportService', () => {
  let service: AttendanceReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
