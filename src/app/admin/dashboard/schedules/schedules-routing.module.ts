import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesComponent } from './schedules.component';
import { NewSchedulesComponent } from './new-schedules/new-schedules.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
const routes: Routes = [
    {
        path: "",
        redirectTo: "schedules",
        pathMatch: "full",
    },
    {
        path: "",
        component: SchedulesComponent,
    },
    {
        path: "create",
        component: NewSchedulesComponent,
    },
    {
        path: "edit/:id",
        component: NewSchedulesComponent,
    },
    {
      path: 'view',
      component: ScheduleViewComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SchedulesRoutingModule { }
