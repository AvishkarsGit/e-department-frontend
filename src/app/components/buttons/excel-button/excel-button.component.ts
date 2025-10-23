import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Strings } from '../../../enums/strings';
import { GlobalService } from '../../../services/global/global.service';
import { HttpService } from '../../../services/http/http.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AttendanceReportService } from '../../../services/attendance-report/attendance-report.service';
// import { SpinnerComponent } from "../../spinner/spinner.component";

@Component({
  selector: 'app-excel-button',
  imports: [MatButtonModule, TooltipModule],
  templateUrl: './excel-button.component.html',
  styleUrl: './excel-button.component.scss',
})
export class ExcelButtonComponent {
  // isExportAll = signal<boolean>(false);

  readonly fileName = input<string>(Strings.APP_NAME);
  readonly values = input<any[]>([]);
  readonly api = input<string>(); // api to get all records
  // allValues = input<any[]>([]);
  readonly pagination = input<boolean>(true);
  readonly isAttendance = input<boolean>(false);
  readonly classId = input<string>('');
  readonly fields = input<string[]>([]);
  readonly sheetName = input<string>('Sheet1');
  readonly tooltip = input<string>('Excel');
  readonly isSending = input<boolean>(false);

  // exportAll = output<boolean>();

  private global = inject(GlobalService);
  private attendanceReportService = inject(AttendanceReportService);

  private http = inject(HttpService);

  constructor() {
    // effect(() => {
    //   if(this.isExportAll() && this.allValues()?.length > 0) {
    //     this.exportToExcel();
    //     this.setIsExportAll(false);
    //   }
    // });
  }

  // setIsExportAll(val: boolean) {
  //   this.isExportAll.set(val);
  // }

  async export() {
    // this.setIsExportAll(false);

    //check if the record is attendance record
    if (this.isAttendance()) {
      //check if class id is provided or not
      if (this.classId() === '' || !this.classId()) {
        this.global.showAlert(
          'Error!',
          'Please provide class which you wants to export data',
          'Ok'
        );
        return;
      }
      //export attendance record
      this.attendanceReportService.exportAttendanceRecord(this.classId());
    } else {
      if (this.pagination()) {
        const result = await this.global.showAlert(
          'Choose an Export Option',
          'Would you like to export all records, or just the records displayed in the table?',
          'Export All Records',
          false,
          'Export Visible Table Records Only',
          'info',
          'primary'
        );

        if (result.isConfirmed) {
          // export all
          // this.setIsExportAll(true);

          // if(this.allValues()?.length === 0) {
          //   this.exportAll.emit(true);
          // }
          this.exportToExcel(true);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === this.global.cancelSwal()
        ) {
          // export only in view
          this.exportToExcel();
        }
      } else {
        this.exportToExcel();
      }
    }
  }

  // Function to retrieve a nested property from an object based on a field path (e.g., 'role.name')
  getNestedValue(obj: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // // Function to transform field names into user-friendly headers
  // generateHeader(field: string): string {
  //   // Remove dots and replace them with spaces
  //   const transformed = field.replace(/\./g, ' ');

  //   // Capitalize the first letter of each word
  //   const capitalized = transformed
  //     .split(' ')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');

  //   return capitalized;
  // }

  // Function to transform field names that contain dots into user-friendly headers
  generateHeader(field: string): string {
    // Check if the field contains a dot
    if (field.includes('.')) {
      // Remove dots and replace them with spaces
      const transformed = field.replace(/\./g, ' ');

      // Capitalize the first letter of each word
      const capitalized = transformed
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return capitalized;
    } else {
      // If there's no dot, return the field name as is
      return field.toUpperCase();
    }
  }

  prepareExcel(values: any[], fields: string[]) {
    // Generate headers dynamically based on the field names
    const headers: string[] = fields.map((field) => this.generateHeader(field));

    // If no fields are provided, use all fields
    const dataToExport = values.map((value) => {
      if (fields.length === 0) {
        // Return all fields if no specific fields are provided
        return value;
      } else {
        // Only return selected fields
        const filteredData: any = {};
        fields.forEach((field, index) => {
          const fieldValue = this.getNestedValue(value, field);
          // if (fieldValue !== undefined) {
          //   filteredData[field] = fieldValue;
          // }
          if (fieldValue !== undefined) {
            filteredData[headers[index]] = fieldValue; // Use dynamically generated header name
          }
        });
        return filteredData;
      }
    });

    return dataToExport;
  }

  async exportToExcel(isExportAll: boolean = false) {
    this.global.showSpinner();
    try {
      // const values = this.isExportAll() ? this.allValues() : this.values();
      let values = this.values();
      if (isExportAll) {
        values = await this.getData();
      }
      const fields = this.fields();
      const sheetName = this.sheetName();

      if (values?.length === 0) {
        this.global.hideSpinner();

        await this.global.showAlert(
          'No Records Found',
          'There are no records available at the moment.',
          'Got it',
          false
        );
        return;
      }

      // prepare data for excel export
      const data = this.prepareExcel(values, fields);

      // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
        header: Object.keys(data[0]),
      });

      const workbook: XLSX.WorkBook = {
        Sheets: { [sheetName]: worksheet },
        SheetNames: [sheetName],
      };

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const file = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });

      saveAs(file, this.fileName() + '.xlsx');
    } catch (e) {
      console.log(e);
      this.global.showErrorMessage(
        e,
        null,
        3000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  async getData() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.api()!)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }
}
