import { Component, Input, Inject,Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { ApiScreenService } from 'src/app/core/service/api-screen.service';
import { SharedService } from 'src/app/core/service/shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-popup-playlist',
	templateUrl: './popup-playlist.component.html',
	styleUrls: ['./popup-playlist.component.scss']
})

export class PopupPlaylistComponent {
  isSearchResultsVisible: boolean = false;
  isSearchplaylistResults: boolean = false;
    @Output() radioButtonSelected = new EventEmitter<boolean>();

	search_screen_text: string = '';
	datatableColumns: any = [
		{ name: 'Name', field: 'name' },
		{ name: 'Last Modified', field: 'updatedDate' },
		{ name: 'Duration', field: 'duration' }
	];
	selectedPlaylist: any;
	datatableRecord: any = [];
  // radioButtonSelected = false;
	constructor(
		private dialog: MatDialog,
		private apiContentService: ApiContentService,
		private apiScreenService: ApiScreenService,
		private apiPlaylistService: ApiPlaylistService,
		private helperService: HelperService,
		private location: Location,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
		private router: Router
	) {

	}

	ngOnInit() {
		this.getPopupList()
		this.sharedService.update_popup_screen_list.subscribe(
			(search_screens) => {
				let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')
				console.log("search_screens: ", search_screens)
				search_screens.forEach((screen: any) => {
					let is_checked = false
					if (selected_screens) {
						is_checked = selected_screens.includes(screen.id) ?? true
					}
					screen.isChecked = is_checked;
					screen.schedule = screen.schedular ?? '---'
					screen.location = screen.location ?? '---'
				})

                this.datatableRecord = search_screens
			}
		)

	}

	getPopupList() {
		this.apiPlaylistService.getPlaylistListWithoutPagination().subscribe((response: any) => {
       console.log('playlist popup', response);
			this.datatableRecord = response.content.map((playlist: any) => {
				playlist.updatedDate = playlist.updatedDate ? this.helperService.formatDate(playlist.updatedDate) : '---';
				return playlist;
			});
		});
	}

	selectPlaylist(playlist: any) {
		this.selectedPlaylist = playlist;
    // this.radioButtonSelected = true;
    this.radioButtonSelected.emit(true);
		console.log("this.selectedPlaylist: ", this.selectedPlaylist)
		this.sharedService.setSchedulePlayListObject(this.selectedPlaylist);
     console.log('radioButtonSelected:', this.radioButtonSelected);

	}
}
