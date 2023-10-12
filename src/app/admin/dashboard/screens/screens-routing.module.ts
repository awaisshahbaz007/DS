import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPaiedScreensComponent } from './no_paired_screens.component';
import { PaircodeComponent } from './paircode/paircode.component';
import { OrientationScreenComponent } from './orientation-screen/orientation-screen.component';
import { ScreenTableComponent } from './screen-table/screen-table.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ScreenTableComponent,
  },
  {
    path: "no_paired",
    component: NoPaiedScreensComponent,
  },
  {
    path: "pair_code",
    component: PaircodeComponent,
  },
  {
    path: "screen_orientation/:id",
    component: OrientationScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreensRoutingModule { }
