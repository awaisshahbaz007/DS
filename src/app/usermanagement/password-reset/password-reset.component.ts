import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/core/service/api.service";
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.sass']
})
export class PasswordResetComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  event_list = [
    {
      img: '../../../assets/images/image-gallery/01.jpg',
    },
     {
      img: '../../../assets/images/image-gallery/02.jpg',
     },
     {
      img: '../../../assets/images/image-gallery/03.jpg',
    },
     {
      img: '../../../assets/images/image-gallery/04.avif',
    },
  ]
  hide = true;
  title ='';
  detail ='';
  is_join = false;
  chide = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService,
    private apiService:ApiService
  ) {
    this.apiService.currentUserSubject.next(null);
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    const currentUrl = this.router.url;

    if (currentUrl.includes('/join')) {
      console.log('The router URL is /join');
      this.title = 'Create Password'
      this.detail = 'Please create your password.'
      this.is_join = true;
    } else {
      console.log('The router URL is not /join');
      this.title = 'Reset Password'
      this.detail = 'Please reset your password.'
    }
  
  }
  decodeEmail(encodedEmail: string): string {
    const plusDecodedEmail = encodedEmail.replace(/\+/g, '%2B');
    const fullyDecodedEmail = decodeURIComponent(plusDecodedEmail);
    return fullyDecodedEmail.replace(/%2B/g, '+');
  }
  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const modifiedEmail = email.replace(/%20/g, '+');
      console.log(modifiedEmail);
    });
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Email:', email);
    console.log('Token:', token);
    this.authForm = this.formBuilder.group({
      email: [email],
      token: [token],
      password: ["", Validators.required],
      cpassword: ["", Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
     
      if(this.is_join){
        let user1= {
          "token": this.authForm.value.token,
          "password": this.authForm.value.password,
          "confirmPassword": this.authForm.value.cpassword
        }
        this.apiService.joinPassword(user1).subscribe((response: any) => {
          this.toastr.success('Success', 'Password changed Successfully',{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-success"
           });
          this.router.navigate([""]);
        })
      } else {
        let user= {
          "token": this.authForm.value.token,
          "newPassword": this.authForm.value.password,
          "confirmNewPassword": this.authForm.value.cpassword
        }
        this.apiService.forgetPassword(user).subscribe((response: any) => {
          this.toastr.success('Success', 'Password changed Successfully',{
            disableTimeOut: false,
             tapToDismiss: true,
             positionClass:'toast-top-right',
             toastClass: "toast-icon custom-toast-success"
           });
          this.router.navigate([""]);
        })
      }
     
    }
  }
}
