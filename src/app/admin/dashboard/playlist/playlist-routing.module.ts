import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistComponent } from './playlist.component';
import { NewPlaylistComponent } from './new-playlist/new-playlist.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    {
        path: "",
        redirectTo: "playlist",
        pathMatch: "full",
    },
    {
        path: "",
        component: PlaylistComponent,
    },
    {
        path: "create",
        component: NewPlaylistComponent,
    },
    {
        path: "edit/:id",
        component: NewPlaylistComponent,
    },
    {
        path: "layout",
        component: LayoutComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlaylistRoutingModule { }
