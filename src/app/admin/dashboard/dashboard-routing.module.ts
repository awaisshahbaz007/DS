
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { Page404Component } from "src/app/usermanagement/page404/page404.component";
import { NoPaiedScreensComponent } from "./screens/no_paired_screens.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "main",
    component: MainComponent,
  },
  {
    path: "content-module",
    loadChildren: () =>
    import("./content-module/content-module.module").then((m) => m.ContentModuleModule),  
  },
  {
    path: "content-module/:list_type",
    loadChildren: () =>
    import("./content-module/content-module.module").then((m) => m.ContentModuleModule),  
  },
  {
    path: "playlist",
    loadChildren: () =>
    import("./playlist/playlist.module").then((m) => m.PlaylistModule),  
  },
  {
    path: "schedules",
    loadChildren: () =>
    import("./schedules/schedules.module").then((m) => m.SchedulesModule),  
  },
  {
    path: "screens",
    loadChildren: () =>
    import("./screens/screens.module").then((m) => m.ScreensModule),  
  },
  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
