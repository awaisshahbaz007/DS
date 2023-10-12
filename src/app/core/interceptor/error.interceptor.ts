import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService,  
    private router:Router,
    private loadingBarService: LoadingBarService,  private toastr:ToastrService,
    ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log('err',err)
        this.loadingBarService.complete();
        if (err.status === 404 ) {
          this.toastr.error('Error',err.error.message,{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-error"
           });

        } else if (err.status === 400 ) {
          this.toastr.error('Error',err.error.message,{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-error"
           });

        } else if (err.status === 0 ) {
          console.log('CPOMINEWII')
          // localStorage.removeItem("token")
          // this.router.navigate(["/usermanagement/signin"]);
          this.toastr.error('Error','CORS Error',{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-error"
           });

        } else {
          this.toastr.error('Error',err.error,{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-error"
           });
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
