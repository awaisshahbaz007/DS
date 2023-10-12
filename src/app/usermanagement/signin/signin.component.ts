import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { environment } from "src/environments/environment";
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "src/app/core/service/api.service";
import { ToastrService } from "ngx-toastr";
declare const gapi: any;
function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (control.value && !emailRegex.test(control.value)) {
    return { 'invalidEmail': true };
  }

  return null;
}
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";

  hide = true;
  event_list = [
    {
      img: '../../../assets/images/image-gallery/01.jpeg',
    },
    {
      img: '../../../assets/images/image-gallery/03.webp',
    }
  ]
  private auth2: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private toastr:ToastrService,
    private apiService: ApiService
  ) {

    super();
  }

  ngOnInit() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
         client_id: '622665291190-t16nn2562avaiau7a3dffaiv9j6k6fuo.apps.googleusercontent.com',
        plugin_name: "chat",
      });
    });
    localStorage.removeItem('currentUser')
    this.translate.use(localStorage.getItem("lang"));
    this.authForm = this.formBuilder.group({
      username: ["admin@adsway.org", [Validators.required, emailValidator]],
      password: ["admin@123", Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get("username").setValue("admin@adsway.org");
    this.authForm.get("password").setValue("admin@123");
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
      const value = this.authForm.value;
      const user = {
        "userName": value.username,
        "password": value.password,
      }
        this.loading = false;
      this.apiService.signIn(user).subscribe((response: any) => {
        this.toastr.success('Success', 'User Login Successfully',{
          disableTimeOut: false,
           tapToDismiss: true,
           positionClass:'toast-top-right',
           toastClass: "toast-icon custom-toast-success"
         });
       
        this.router.navigate(["/admin/dashboard/main"]);
        this.loading = false;
      },
          (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          });
    }
  }
  onClick(){
    this.router.navigateByUrl('/usermanagement/signup')
  }
  
  async onGoogleClick() {
    console.log('weofwijeofi')
    gapi.auth2.getAuthInstance().signIn().then((result) => {
      console.log('wefwiefo',result)
      const user = result.getBasicProfile();
      const firstName = user.getGivenName();
      const lastName = user.getFamilyName();
      const email = user.getEmail();
      const accessToken = result.getAuthResponse().id_token;
      console.log('Access token:', accessToken);
            console.log('First Name:', firstName);
      console.log('Last Name:', lastName);
      const userDetail = {
        "Authorization": accessToken,
      }
      this.apiService.signInGoogle(userDetail).subscribe((response: any) => {
        this.toastr.success('Success', 'User Login Successfully',{
          disableTimeOut: false,
           tapToDismiss: true,
           positionClass:'toast-top-right',
           toastClass: "toast-icon custom-toast-success"
         });
       
        this.router.navigate(["/admin/dashboard/main"]);
        this.loading = false;
      },
          (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          });
      // Handle successful sign-in.
    }).catch((error: any) => {
      // Handle sign-in error.
    });
  }
}
