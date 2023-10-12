import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentModuleComponent } from './content-module.component';
import { FolderDataComponent } from './folder-data/folder-data.component';
// import { FolderDataComponent } from './folder-data/folder-data.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "content-module",
    pathMatch: "full",
  },
  {
    path: "",
    component: ContentModuleComponent,
  },
  {
    path: "folder/:id",
    component: FolderDataComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentModuleRoutingModule { }
