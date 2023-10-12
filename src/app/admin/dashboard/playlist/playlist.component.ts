import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { ApiFolderService } from 'src/app/core/service/api-folder.service';
import { SharedService } from 'src/app/core/service/shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-playlist',
	templateUrl: './playlist.component.html',
	styleUrls: ['./playlist.component.scss']
})

export class PlaylistComponent {

	search_placeholder_text = "Search for playlist names"
	pagination = {
		totalPage: 0,
		pageNumber: 0,
		pageSize: 5,
		totalItems: 0,

		pageSizeOptions: [5, 10, 20],
		sortBy: 'updatedDate',
		sortOrder: 'DESC',
		contentType: 'ALL'
	}

	datatableRecord: any = [];

	datatableColumns = [
		{ name: 'Name', field: 'name', sortable: true },
		{ name: 'Last Modified', field: 'lastmodified', sortable: true },
		{ name: 'Size', field: 'size', sortable: true },
		{ name: 'Duration', field: 'duration', sortable: true },
	];

	datatableActions = [
		{ label: 'Edit', action: this.onEditList.bind(this) },
		{ label: 'Preview', action: this.onPreviewList.bind(this) },
		{ label: 'Delete', action: this.onDeleteRow.bind(this) },
	];

	check_all_drop_down_actions: any[] = [
		{ title: 'Set to Screens' },
		{ title: 'Delete All' },
	];

	constructor(
		private dialog: MatDialog,
		private apiContentService: ApiContentService,
		private apiFolderService: ApiFolderService,
		private apiPlaylistService: ApiPlaylistService,
		private helperService: HelperService,
		private location: Location,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
		private router: Router
	) {
		this.sharedService.setModuleType('playlist')
	}

	ngOnInit() {
		console.log("ngOnInit PlayList Module: ")
		this.helperService.removeObjectFromLocatStorage('playlist_object')
		this.sharedService.setTriggerOfSearchPlaceHolderText(this.search_placeholder_text)

		this.getPlaylistList()
	}

	receiveDatatableOperation(datatable_operation_details: any) {
		console.log("receiveDatatableOperation: ", datatable_operation_details)
		this.pagination.sortBy = (datatable_operation_details.active != "lastmodified") ? datatable_operation_details.active : 'updatedDate'
		this.pagination.sortOrder = datatable_operation_details.direction

		this.getPlaylistList();
	}

	receiveActionType(bulk_action_record: string) {
		console.log("receiveActionType: ", JSON.parse(bulk_action_record))
		let receive_data = JSON.parse(bulk_action_record);
		if (receive_data.bulk_action_type == "Delete All") {
			this.DeleteBulkContent(bulk_action_record);
		} else if (receive_data.bulk_action_type == "Set to Screens") {
			// this.onBulkAddTo(bulk_action_record);
		}
	}

	DeleteBulkContent (bulk_action_record) {
		var text_to_show = 'Are you sure, you want to delete all the playlists selected?'

		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'playlist',
				bulk_action_data: bulk_action_record,
				title: 'Delete',
				action: "Delete",
				text_to_show: text_to_show,
				value: '',
				type: '6'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe((result: boolean) => {
			this.getPlaylistList();
		});
	}

	onPreviewList(row: any) {
		console.log('Edit row:', row);
	}

	onEditList(row: any) {
		console.log('Edit row:', row);
		this.router.navigate(['/admin/dashboard/playlist/edit', row.id]);
	}

	onDeleteRow(row: any) {
		console.log('onDeleteRow row:', row);

		var text_to_show = 'Are you sure, you want to delete this Playlist?'
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'playlist',
				response_data: row,
				title: 'Delete',
				action: "Delete",
				text_to_show: text_to_show,
				value: '',
				type: '6'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe(() => {
			this.getPlaylistList()
		});
	}

	getPlaylistList() {
  this.apiPlaylistService.getPlaylistList(this.pagination).subscribe((response: any) => {
    let all_playlist = response.content;
    all_playlist.forEach((playlist: any) => {
      playlist.lastmodified = playlist.updatedDate ? this.helperService.formatDate(playlist.updatedDate) : '---';
      playlist.size = playlist.size ? this.helperService.convertSize(playlist.size) : '---';
      playlist.duration = playlist.duration ?? '---';
      playlist.isChecked = false;
    });

    // Set the datatableRecord and pagination properties based on the API response
    this.datatableRecord = all_playlist;
    this.settingDataTableProperties(response);
  });
}

	settingDataTableProperties(api_response: any, reset_properties = 0) {
		// setting datatable operation related stuff
		if (reset_properties == 1) {
			this.pagination = {
				totalPage: 0,
				pageNumber: 0,
				pageSize: 5,
				totalItems: 0,

				pageSizeOptions: [5, 10, 20],
				sortBy: 'updatedDate',
				sortOrder: 'DESC',
				contentType: 'ALL'
			}
		}
		this.pagination.totalPage = api_response.totalPages
		this.pagination.pageNumber = api_response.number
		this.pagination.pageSize = api_response.size
		this.pagination.totalItems = api_response.totalElements
	}

	pageChangeEvent(event: any) {
		console.log('pageChangeEvent', event)
		if (this.pagination.pageSize != event.pageSize) {
			this.pagination.pageNumber = 0
		} else {
			this.pagination.pageNumber = event.pageIndex
		}
		this.pagination.pageSize = event.pageSize
		this.pagination.totalItems = event.length

		this.getPlaylistList();
	}
   shouldShowPagination() {
    // Return true if the total number of items is greater than 5, otherwise false
    return this.pagination.totalItems > 5;
  }
}
