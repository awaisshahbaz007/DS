import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Page500Component } from "./page500/page500.component";
import { Page404Component } from "./page404/page404.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { LockedComponent } from "./locked/locked.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ComponentsModule } from "../shared/components/components.module";
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UsermanagementRoutingModule } from "./usermanagement-routing.module";
import { UsersListComponent } from './users/users-list/users-list.component';
import { TranslateModule } from "@ngx-translate/core";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LocationComponent } from './location/location.component';
import { SuccessPageMailComponent } from './success-page-mail/success-page-mail.component';

@NgModule({
  declarations: [
    Page500Component,
    Page404Component,
    SigninComponent,
    SignupComponent,
    LockedComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    UsersListComponent,
    LocationComponent,
    SuccessPageMailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    TranslateModule,
    ReactiveFormsModule,
    UsermanagementRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],

})
export class UsermanagementModule {}
