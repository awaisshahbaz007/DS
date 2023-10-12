import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";

import { AuthService } from "../service/auth.service";
import { ApiService } from "../service/api.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router,private apiService:ApiService,private authser:AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log("AUTH GUARD:::::");
    if (this.apiService.currentUserValue) {
      // console.log("User is logged in",state.url);
      if (state.url === "/usermanagement/signin") {
        this.router.navigate(["/admin/dashboard/main"]);
        return false;
      }
      if (state.url === "/usermanagement/signup") {
        this.router.navigate(["/admin/dashboard/main"]);
        return false;
      }
      if (state.url === "/usermanagement/password-reset") {
        console.log('COMIWE')
        return false;
      }
      if (state.url === "/usermanagement/join") {
        console.log('COMIWE')
        return false;
      }
      return true;
    } else {
      console.log("User is not logged in");
      if (state.url !== "/usermanagement/signin") {
        this.router.navigate(["/usermanagement/signin"]);
        return false;
      }
      return true;
    }
  }
}
