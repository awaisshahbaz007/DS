import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guard/auth.guard";
import { Role } from "./core/models/role";
import { Page404Component } from "./usermanagement/page404/page404.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "/usermanagement/signin",
    pathMatch: "full",
  },
  {
    canActivate:[AuthGuard],
    path: 'admin',
    loadChildren: () =>
    import("./admin/admin.module").then((m) => m.AdminModule),  
  },
  {
    canActivate:[AuthGuard],
    path: 'usermanagement',
    loadChildren: () =>
    import("./usermanagement/usermanagement.module").then(
      (m) => m.UsermanagementModule
    ),
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
