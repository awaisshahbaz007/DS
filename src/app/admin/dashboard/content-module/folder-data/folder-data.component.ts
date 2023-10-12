import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiFolderContentService } from 'src/app/core/service/api-folder-content.service';
import { ApiFolderService } from 'src/app/core/service/api-folder.service';
import { SharedService } from 'src/app/core/service/shared.service';
import { HelperService } from "src/app/core/service/helper.service";
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { el } from '@fullcalendar/core/internal-common';

@Component({
	selector: 'app-folder-data',
	templateUrl: './folder-data.component.html',
	styleUrls: ['./folder-data.component.scss']
})

export class FolderDataComponent {
	upload_section: boolean = true;
	FolderId: number;
	folder_name: string;
	showFileSelection: boolean = true;

	check_all_drop_down_actions: any[] = [
		{ title: 'Remove All' },
		{ title: 'Add To' },
	];
	datatableRecord: any[] = [];
	datatableActions: any = [];
	datatableColumns = [
		{ name: 'Name', field: 'name', sortable: true },
		{ name: 'Last Modified', field: 'lastmodified', sortable: true },
		{ name: 'Size', field: 'size', sortable: true },
		{ name: 'Format', field: 'format', sortable: true },
	];

	pagination = {
		totalPage: 0,
		pageNumber: 0,
		pageSize: 5,
		totalItems: 0,

		pageSizeOptions: [5, 10, 20],
		sortBy: 'updatedDate',
		sortOrder: 'DESC'
	}

	constructor(
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private apiFolderService: ApiFolderService,
		private apiContentService: ApiContentService,
		private apiFolderContentService: ApiFolderContentService,
		private helperService: HelperService,
		private sharedService: SharedService,
	) {
		console.log("folder page")
		// Trigger to refresh when file uploaded within this page through Header Upload Button
		this.sharedService.file_uploaded.subscribe(
			(file_upload) => {
				if (this.FolderId) {
					console.log("file_uploaded From Header Section inside Folder Data Component: ", file_upload)
					this.getFolderContentList();
				}
			}
		);

	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.FolderId = params['id']; // Assuming the route parameter is named 'id'
			this.sharedService.setFolderIDValue(this.FolderId);
		});

		if (this.FolderId) {
			this.apiFolderService.getFolderDetails(this.FolderId).subscribe((response: any) => {
				console.log('getFolderDetails', response)
				this.folder_name = response.name
			})

			this.getFolderContentList();
		}
	}

	onAddPlaylist(row: any) {
		console.log('onAddPlaylist row:', row);
		this.apiContentService.getSelectedItemDetailsInPopup(row.id, true)
	}

	onAddTo(row: any) {
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				response_data: row,
				title: 'Add Item to the folder',
				action: "Add",
				value: '',
				type: '12'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.getFolderContentList()
		});
	}

	onShowList(row: any) {
		console.log('onShowList row:', row);
	}

	onRemoveRow(row: any) {
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				response_data: row,
				folder_id: this.FolderId,
				title: 'Remove',
				action: "Remove",
				text_to_show: 'Are you sure, you want to remove this content from this Folder?',
				value: '',
				type: '13'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.getFolderContentList()
		});
	}

	onRenameRow(row: any) {
		console.log('onRenameRow row:', row);
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				response_data: row,
				title: "Rename Content",
				action: "Rename Content",
				value: '',
				type: '5'
			},
			direction: 'ltr',
		});
		dialogRef.afterClosed().subscribe(() => {
			this.getFolderContentList()
		});
	}

	getFolderContentList() {
		this.datatableActions = [
			{ label: 'Add to Playlist', action: this.onAddPlaylist.bind(this) },
			{ label: 'Show Playlist using this', action: this.onShowList.bind(this) },
			{ label: 'Rename', action: this.onRenameRow.bind(this) },
			{ label: 'Add To', action: this.onAddTo.bind(this) },
			{ label: 'Remove', action: this.onRemoveRow.bind(this) },
		];

		this.apiFolderContentService.getFolderContentList(this.FolderId, this.pagination).subscribe((response: any) => {
			let folder_content_items = response.contents.content
			if (Object.keys(folder_content_items).length == 0) {
				this.showFileSelection = true
				return;
			}

			folder_content_items.forEach((item: any) => {
				item.name = item.name + " | " + item.thumbLink
				item.lastmodified = item.updatedDate ? this.helperService.formatDate(item.updatedDate) : '---'
				item.size = this.helperService.convertSize(item.size) ?? '---'
				item.isChecked = false

			})
			this.datatableRecord = folder_content_items;
			this.showFileSelection = false

			this.settingDataTableProperties(response.contents)
		})
	}

	receiveActionType(bulk_action_record: string) {
		console.log("receiveActionType: ", JSON.parse(bulk_action_record))
		let receive_data = JSON.parse(bulk_action_record);
		if (receive_data.bulk_action_type == "Remove All") {
			this.RemoveBulkContent(bulk_action_record);

		} else if (receive_data.bulk_action_type == "Add To") {
			this.onBulkAddTo(bulk_action_record);
		}
	}

	receiveUploadFileStatus(status: boolean) {
		console.log("receiveUploadFileStatus: ", status)

		if (status) {
			this.upload_section = status;
			this.getFolderContentList();
		}
	}
	
	receiveSelectedRow(selected_row: any) {
		console.log("receiveSelectedRow: ", selected_row)
		this.apiContentService.getSelectedItemDetailsInPopup(selected_row.id)
	}

	receiveDatatableOperation(datatable_operation_details: any) {
		console.log("receiveDatatableOperation: ", datatable_operation_details)
		this.pagination.sortBy = (datatable_operation_details.active != "lastmodified") ? datatable_operation_details.active : 'updatedDate' 
		this.pagination.sortOrder = datatable_operation_details.direction

		this.getFolderContentList();
	}

	onBulkAddTo(bulk_action_record) {
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				bulk_action_data: bulk_action_record,
				title: 'Add Items to the folder',
				action: "Add",
				value: '',
				type: '12'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.getFolderContentList()
		});
	}

	RemoveBulkContent (bulk_action_record) {
		console.log('RemoveBulkContent:');

		var text_to_show = 'Are you sure, you want to remove all the contents selected?'

		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				list_type: 'Content',
				bulk_action_data: bulk_action_record,
				folder_id: this.FolderId,
				title: 'Remove',
				action: "Remove",
				text_to_show: text_to_show,
				value: '',
				type: '13'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe(() => {
			this.getFolderContentList()
		});
	}

	settingDataTableProperties (api_response) {
		// setting datatable operation related stuff 
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

		this.getFolderContentList();
	}
}
