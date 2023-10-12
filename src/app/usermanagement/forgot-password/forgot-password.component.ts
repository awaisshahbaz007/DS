import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/core/service/api.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  event_list = [
    {
      img: '../../../assets/images/image-gallery/05.jpg',
    }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService,
    private apiService:ApiService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        "admin@gym.com",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
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
      let user= {
        email :this.authForm.value.email
      }
      this.apiService.sendPasswordForMail(user).subscribe((response: any) => {
        this.toastr.success('Success', 'Please Check the mail',{
          disableTimeOut: false,
           tapToDismiss: true,
           positionClass:'toast-top-right',
           toastClass: "toast-icon custom-toast-success"
         })
        this.router.navigate(["/usermanagement/success"]);
      })
    }
  }
}
