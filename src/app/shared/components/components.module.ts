import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedModule } from '../shared.module';
import { ButtonComponent } from './button/button.component';
import { CaroselComponent } from './carosel/carosel.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TableComponent } from './table/table.component';
import { MaterialModule } from '../material.module';
import { WrapperComponent } from './wrapper/wrapper.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { SearchComponent } from './search/search.component';
import { PopupComponent } from './popup/popup.component';
import { FormComponent } from './form/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatSortModule } from '@angular/material/sort';
import { CustomToastComponent } from './custom-toast/custom-toast.component';
import { RecentItemPopupComponent } from 'src/app/admin/dashboard/content-module/recent-items/recent-item-popup/recent-item-popup.component';
import { RemoveItemComponent } from 'src/app/admin/dashboard/content-module/remove-item/remove-item.component';
import { RenameItemComponent } from 'src/app/admin/dashboard/content-module/rename-item/rename-item.component';
import { DeleteItemComponent } from 'src/app/admin/dashboard/content-module/delete-item/delete-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FolderPopupComponent } from 'src/app/admin/dashboard/content-module/folder-popup/folder-popup.component';
import { MoveItemComponent } from 'src/app/admin/dashboard/content-module/move-item/move-item.component';
import { ShowPlaylistComponent } from 'src/app/admin/dashboard/content-module/show-playlist/show-playlist.component';
import { ScreenListComponent } from 'src/app/admin/dashboard/schedules/screen-list/screen-list.component';
import { PopupPlaylistComponent } from 'src/app/admin/dashboard/playlist/popup-playlist/popup-playlist.component';
import { PopupSearchComponent } from './popup-search/popup-search.component';
import { PreviewPlaylistComponent } from 'src/app/admin/dashboard/playlist/preview-playlist/preview-playlist.component';

const ComponentLists = [
    FileUploadComponent, SearchComponent, FormComponent, PopupComponent, BreadcrumbComponent, TitleBarComponent, WrapperComponent, ButtonComponent,
    CaroselComponent, TableComponent, PaginatorComponent, RecentItemPopupComponent, RemoveItemComponent, RenameItemComponent, DeleteItemComponent,
    FolderPopupComponent, MoveItemComponent, ShowPlaylistComponent, ScreenListComponent, PopupPlaylistComponent, PreviewPlaylistComponent
]
@NgModule({
    declarations: [ComponentLists, CustomToastComponent, PopupSearchComponent],
    imports: [SharedModule, SlickCarouselModule, MaterialModule, MatSortModule, MatPaginatorModule],
    exports: [ComponentLists, CustomToastComponent],
})
export class ComponentsModule { }
