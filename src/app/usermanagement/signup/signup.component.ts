import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/core/service/api.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  event_list = [
    {
      img: '../../../assets/images/image-gallery/04.png',
    },
  ]
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService,
    private apiService: ApiService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ["", Validators.required],
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
      const value = this.authForm.value;
      const user = {
        "id": 0,
        "userName": value.email,
        "password": value.password,
        "firstName": value.firstName,
        "lastName": value.lastName,
        "loginProviderType": "0",
        "organizationId": 0,
        "locationId": 0,
        "roleId": 0,
        "active": true
      }
      this.apiService.signUp(user).subscribe((response: any) => {
        this.toastr.success('Success', 'Email  successfully send to the user',{
          disableTimeOut: false,
           tapToDismiss: true,
           positionClass:'toast-top-right',
           toastClass: "toast-icon custom-toast-success"
         });
        this.router.navigate(["/admin/dashboard/main"]);
      });

    }
  }
  onClick(){
    this.router.navigateByUrl('/usermanagement/signin')
  }
   
}
