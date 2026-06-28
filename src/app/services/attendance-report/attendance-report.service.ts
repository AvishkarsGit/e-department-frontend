import { inject, Injectable } from '@angular/core';
import { AttendanceService } from '../attendance/attendance.service';
import * as Excel from 'exceljs';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { HttpService } from '../http/http.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root',
})
export class AttendanceReportService {
  private apiUrl = 'reports';
  private http = inject(HttpService);
  private attendanceService = inject(AttendanceService);
  private global = inject(GlobalService);

  async uploadToCloudinary(buffer: ArrayBuffer, fileName: string) {
    try {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      console.log('blob', blob);
      const formData = new FormData();
      formData.append('file', blob, fileName);

      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl + '/upload', formData, true)
      );
      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response;
    } catch (error) {}
  }

  async exportAttendanceRecord(class_id?: string, isSending: boolean = false) {
    const workbook = new Excel.Workbook();

    // 1️⃣ Get subjects
    const response = await this.attendanceService.fetchSubjectsByClass(
      class_id!
    );
    const subjects = response?.data || [];

    for (let subject of subjects) {
      // 2️⃣ Fetch attendance summary
      const res = await this.attendanceService.filterAttendanceForExport({
        class_id: class_id!,
        subject_id: subject?._id,
      });
      const data = res?.data || [];

      if (!data.length) continue;

      // 3️⃣ Generate lecture headers from first student’s records
      const firstStudent = data[0];
      const lectureHeaders = firstStudent.records.map(
        (rec: any, index: number) =>
          `${moment(rec.date).format('DD-MM-YYYY')} (${index + 1})`
      );

      // 4️⃣ Create worksheet
      const worksheet = workbook.addWorksheet(subject?.name || 'Sheet');

      // 5️⃣ Build header row
      const headers = [
        'Roll No',
        'Student Name',
        'Total Classes',
        'Total Attended',
        'Percentage',
        ...lectureHeaders,
      ];
      const headerRow = worksheet.addRow(headers);

      // Style header row
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 30;

      // 6️⃣ Fill student rows
      for (let student of data) {
        const lectureStatus = student.records.map((rec: any) =>
          rec.status === 'present' ? 'P' : 'A'
        );
        while (lectureStatus.length < lectureHeaders.length)
          lectureStatus.push('-');

        const percentage =
          ((student.total_present / student.total_classes) * 100).toFixed(2) +
          '%';

        const row = [
          student.roll_no,
          student.student_name,
          student.total_classes,
          student.total_present,
          percentage,
          ...lectureStatus,
        ];

        const studentRow = worksheet.addRow(row);

        // ✅ Center align each cell individually
        studentRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }

      // 7️⃣ Auto-width columns
      worksheet.columns?.forEach((column) => {
        if (!column) return; // extra safety
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length + 2);
        });
        column.width = maxLength;
      });
    }

    // 8 Save workbook
    const buffer = await workbook.xlsx.writeBuffer();

    if (isSending) {
      const fileName = `${Date.now().toLocaleString()}_Attendance.xlsx`;
      const response = await this.uploadToCloudinary(buffer, fileName);
      console.log('✅ Uploaded to Cloudinary:', response);
      return;
    }
    saveAs(new Blob([buffer]), `Attendance.xlsx`);
  }

  async sendBulkMessage(classId?: string, criteria?: number) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl + '/send/bulk/message', {
          class_id: classId,
          criteria: criteria
        })
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
