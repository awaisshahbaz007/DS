import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockedComponent } from "./locked/locked.component";
import { Page404Component } from "./page404/page404.component";
import { Page500Component } from "./page500/page500.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { UsersListComponent } from "./users/users-list/users-list.component";
import { AuthGuard } from "../core/guard/auth.guard";
import { LocationComponent } from "./location/location.component";
import { SuccessPageMailComponent } from "./success-page-mail/success-page-mail.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full",
  },
  {
    path: "signin",
    component: SigninComponent,
   // canActivate: [AuthGuard],
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "locked",
    component: LockedComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
  {
    path:"password-reset",
    component:PasswordResetComponent
  },
  {
    path:"success",
    component:SuccessPageMailComponent
  },
  {
    path:"join",
    component:PasswordResetComponent
  },
  {
    path:"location",
    component:LocationComponent
  },
  {
    path:"users",
    component:UsersListComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermanagementRoutingModule {}
