import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MainComponent } from "./main/main.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ContentModuleComponent } from './content-module/content-module.component';
import { ContentModuleModule } from "./content-module/content-module.module";
import { RecentItemsComponent } from './content-module/recent-items/recent-items.component';
import { FolderDataComponent } from "./content-module/folder-data/folder-data.component";
import { PlaylistComponent } from './playlist/playlist.component';
import { NewPlaylistComponent } from './playlist/new-playlist/new-playlist.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutComponent } from "./playlist/layout/layout.component";
import { SchedulesComponent } from './schedules/schedules.component';
import { FullCalendarModule } from "@fullcalendar/angular";
import { NewSchedulesComponent } from "./schedules/new-schedules/new-schedules.component";
import { NoPaiedScreensComponent } from './screens/no_paired_screens.component';
import { OrientationScreenComponent } from "./screens/orientation-screen/orientation-screen.component";
import { ScreenTableComponent } from "./screens/screen-table/screen-table.component";
import { ScheduleViewComponent } from './schedules/schedule-view/schedule-view.component';

@NgModule({
  declarations: [MainComponent, ContentModuleComponent, RecentItemsComponent, FolderDataComponent, PlaylistComponent, NewPlaylistComponent, LayoutComponent, SchedulesComponent, NewSchedulesComponent, NoPaiedScreensComponent, OrientationScreenComponent, ScreenTableComponent,ScheduleViewComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    ComponentsModule,
    SharedModule,
    ContentModuleModule,
    SlickCarouselModule,
    DragDropModule,
    FullCalendarModule
  ],
})
export class DashboardModule {}
