import { DatePipe } from '@angular/common';
import { inject, Injectable, signal, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPrintService, PrintOptions } from 'ngx-print';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  modalRef = signal<BsModalRef | null>(null);
  nestedModalRef = signal<BsModalRef | null>(null);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modalService = inject(BsModalService);
  private printService = inject(NgxPrintService);

  constructor() {}

  navigate(routePlace: any[], data?: any) {
    this.router.navigate(routePlace, data);
  }

  navigateByUrl(url: string, replaceUrl = true) {
    this.router.navigateByUrl(url, { replaceUrl });
  }

  activeRoute(data: any) {
    return this.activatedRoute.snapshot.params[data];
  }

  dateFormat(date: any, format: string) {
    return this.datePipe.transform(date, format);
  }

  // toast
  showSuccess(
    msg: string,
    title: string | null,
    duration: number,
    progressBar: any,
    progressAnimation: any,
    position: any
  ) {
    this.toastr.success(msg, title!, {
      timeOut: duration,
      progressBar: progressBar,
      progressAnimation: progressAnimation,
      positionClass: position,
    });
  }

  showErrorMessage(
    msg: any,
    title: string | null,
    duration: number,
    progressBar: any,
    progressAnimation: any,
    position: any,
    isError = true
  ) {
    if (isError) {
      msg = msg?.error?.message || 'Error! Please check & try again...';
    }
    this.toastr.error(msg, title!, {
      timeOut: duration,
      progressBar: progressBar,
      progressAnimation: progressAnimation,
      positionClass: position,
    });
  }

  showInfo(
    msg: string,
    title: string,
    duration: number,
    progressBar: any,
    progressAnimation: any,
    position: any
  ) {
    this.toastr.info(msg, title, {
      timeOut: duration,
      progressBar: progressBar,
      progressAnimation: progressAnimation,
      positionClass: position,
    });
  }

  showWarning(
    msg: string,
    title: string,
    duration: number,
    progressBar: any,
    progressAnimation: any,
    position: any
  ) {
    this.toastr.warning(msg, title, {
      timeOut: duration,
      progressBar: progressBar,
      progressAnimation: progressAnimation,
      positionClass: position,
    });
  }

  async showAlert(
    header: string,
    message: any,
    confirmButtonText: string,
    isError = true,
    cancelButtonText?: string,
    icon?: any,
    cancelButtonColor = 'danger'
  ) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: cancelButtonText
          ? `btn btn-${cancelButtonColor} my-actions`
          : '',
      },
      buttonsStyling: false,
    });

    if (isError) {
      message =
        typeof message === 'string'
          ? message
          : message?.error?.message ?? 'Something went wrong, please try again';
    }

    const result = await swalWithBootstrapButtons.fire({
      title: header,
      text: message,
      icon: icon ? icon : 'warning',
      showCancelButton: cancelButtonText ? true : false,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
    });
    return result;
    // .then((result) => {
    //   if (result.isConfirmed) {
    //     if(confirmButtonHandler) {
    //       console.log('yes');
    //       confirmButtonHandler;
    //     }
    //   } else if (
    //     /* Read more about handling dismissals below */
    //     result.dismiss === Swal.DismissReason.cancel
    //   ) {
    //     // swalWithBootstrapButtons.fire(
    //     //   'Cancelled',
    //     //   'Your imaginary file is safe :)',
    //     //   'error'
    //     // )
    //     if(cancelButtonHandler) cancelButtonHandler;
    //   }
    // });
  }

  cancelSwal() {
    return Swal.DismissReason.cancel;
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  // Modal
  hideModal() {
    this.modalRef()!.hide();
  }

  hideNestedModal() {
    this.nestedModalRef()!.hide();
  }

  showModal(template: TemplateRef<any>) {
    this.modalRef.set(this.modalService.show(template, { class: 'modal-lg' }));
  }

  showNestedModal(template: TemplateRef<any>) {
    this.nestedModalRef.set(
      this.modalService.show(template, { class: 'modal-lg' })
    );
  }

  onHiddenModal() {
    if (this.modalRef()?.onHide) {
      return this.modalRef()!.onHide;
    }
    return null;
  }

  // formatNumber(num: number) {
  //   return parseFloat(this.decimalPipe.transform(num, '1.2-2'));
  // }
  formatNumber(num: number, fix_to?: number) {
    return parseFloat(num.toFixed(fix_to || 2));
  }

  print(id: string, title: string) {
    try {
      const customPrintOptions: PrintOptions = new PrintOptions({
        printSectionId: id,
        useExistingCss: true,
        // printTitle: title,
        // Add any other print options as needed
      });
      this.printService.print(customPrintOptions);
    } catch (e) {
      throw e;
    }
  }

  playAudio() {
    let audio = new Audio();
    audio.src = '../../assets/sounds/notification.wav';
    audio.load();
    audio.play();
  }
}
