import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiFolderService } from 'src/app/core/service/api-folder.service';
import { SharedService } from 'src/app/core/service/shared.service';
import { Location } from '@angular/common';

/**
 * @title Table with selection
 */

@Component({
	selector: 'app-content-module',
	templateUrl: './content-module.component.html',
	styleUrls: ['./content-module.component.sass']
})

export class ContentModuleComponent {

	@Input() received_list_type: string;
  showPagination: boolean = false;
	search_placeholder_text = "Search File Or Folder Name"
	list_type: string;
	recent_item: any[] = [];
	datatableRecord: any[] = [];
	datatableActions: any[] = [];

	check_all_drop_down_actions: any[] = [
		{ title: 'Delete All' },
		{ title: 'Add To' },
	];

	datatableColumns: any[] = [
		{ name: 'Name', field: 'name', sortable: true },
		{ name: 'Last Modified', field: 'lastmodified', sortable: true },
		{ name: 'Size', field: 'size', sortable: true },
		{ name: 'Format', field: 'format', sortable: true },
	]

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

	constructor(
		private dialog: MatDialog,
		private apiContentService: ApiContentService,
		private apiFolderService: ApiFolderService,
		private helperService: HelperService,
		private location: Location,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService
	) {
		console.log("ContentModuleComponent: ", data)
		this.sharedService.setModuleType('content')
		this.sharedService.setTriggerOfSearchPlaceHolderText(this.search_placeholder_text)

		// Trigger to refresh when file uploaded within this page through Header Upload Button
		this.sharedService.file_uploaded.subscribe(
			(file_upload) => {
				console.log("file_uploaded From Header Section : ", file_upload)
				this.getRecentItems();
				this.getContentList();
			}
		);
	}

	ngOnInit() {
		console.log("ngOnInit Content Module: ")
		this.getRecentItems()
    if (this.datatableRecord.length >= 5) {
      this.showPagination = true;
    }
	}

	receiveListType(list_type: string) {
		console.log("receiveListType: ", list_type)
		if (list_type == "Folder") {
			this.datatableActions = [
				{ label: 'Rename', action: this.onRenameRow.bind(this) },
				{ label: 'Delete', action: this.onDeleteRow.bind(this) },
			];
			this.check_all_drop_down_actions = [
				{ title: 'Delete All' },
			];
			this.settingDataTableProperties({}, 1)
			this.getFolderList()
		} else {
			this.datatableActions = [
				{ label: 'Add to Playlist', action: this.onAddPlaylist.bind(this) },
				{ label: 'Show Playlist using this', action: this.onShowList.bind(this) },
				{ label: 'Rename', action: this.onRenameRow.bind(this)},
				{ label: 'Add To', action: this.onAddTo.bind(this) },
				{ label: 'Delete', action: this.onDeleteRow.bind(this) },
			];
			this.check_all_drop_down_actions = [
				{ title: 'Delete All' },
				{ title: 'Add To' },
			];
			this.settingDataTableProperties({}, 1)
			this.getContentList()
		}
		this.list_type = list_type
		this.location.go("/admin/dashboard/content-module/" + list_type);
	}

	receiveActionType(bulk_action_record: string) {
		console.log("receiveActionType: ", JSON.parse(bulk_action_record))
		let receive_data = JSON.parse(bulk_action_record);
		if (receive_data.bulk_action_type == "Delete All") {
			this.DeleteBulkContent(bulk_action_record);

		} else if (receive_data.bulk_action_type == "Add To") {
			this.onBulkAddTo(bulk_action_record);
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

		this.reloadDataTable();
	}

	datatableReloadEvent(list_to_reload: string) {
		console.log("datatableReloadEvent: ", list_to_reload)
	}

	onClickAddFolderBtn() {
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				title: 'Create Folder',
				action: "Create",
				value: '',
				type: '7'
			},
			direction: 'ltr',
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if(result){
			   this.reloadDataTable();
		    }
		});
	}

	onRenameRow(row: any) {
		console.log('onRenameRow row:', row);
		let title = "Rename Content"
		if (row.parentFolderId !== undefined) {
			title = "Rename Folder"
		}
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				response_data: row,
				title: title,
				action: title,
				value: '',
				type: '5'
			},
			direction: 'ltr',
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if(result){
			   this.reloadDataTable();
		    }
		});
	}

	onAddPlaylist(row: any) {
		console.log('onAddPlaylist row:', row);
		this.apiContentService.getSelectedItemDetailsInPopup(row.id, true)
	}

	onShowList(row: any) {
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				response_data: row,
				title: 'Show Playlist',
				action: "",
				value: '',
				type: '14'
			},
			direction: 'ltr',
		});
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

		dialogRef.afterClosed().subscribe((result: boolean) => {
			if(result){
			   this.reloadDataTable();
		    }
		});
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

		dialogRef.afterClosed().subscribe((result: boolean) => {
			if(result){
			   this.reloadDataTable();
		    }
		});
	}

	DeleteBulkContent (bulk_action_record) {
		console.log('DeleteBulkContent list_type:', this.list_type);

		var text_to_show = 'Are you sure, you want to delete all the contents selected?'
		if (this.list_type == "Folder") {
			text_to_show = 'Are you sure, you want to delete all the folders selected?'
		}

		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				list_type: this.list_type,
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
			if(result){
			   this.reloadDataTable();
		    }
		});
	}

	onDeleteRow(row: any) {
		console.log('onDeleteRow row:', row);

		var text_to_show = 'Are you sure, you want to delete this content?'
		if (this.list_type == "Folder") {
			text_to_show = 'Are you sure, you want to delete this Folder?'
		}
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				list_type: this.list_type,
				response_data: row,
				title: 'Delete',
				action: "Delete",
				text_to_show: text_to_show,
				value: '',
				type: '6'
			},
			direction: 'ltr',
		});

		dialogRef.afterClosed().subscribe((result: boolean) => {
			if(result){
			   this.reloadDataTable();
		    }
		});
	}

	getRecentItems() {
		this.apiContentService.getContentRecentItems().subscribe((response: any) => {
			let recent_items = []
			response.forEach((el: any) => {
				recent_items.push({
					id: el.id,
					type: el.contentType,
					videotype: el.permaLink.slice(el.permaLink.lastIndexOf('.') + 1),
					localtion_id: el.locationId,
					organization_id: el.organizationId,
					thumb_link: el.thumbLink,
					perma_link: el.permaLink,
					name: this.helperService.textTransform(el.name),
				});
			})
			this.recent_item = recent_items
		})
	}

	getFolderList() {
		this.apiFolderService.getFolderList(this.pagination).subscribe((response: any) => {
			let all_folders = response.content
			all_folders.forEach((folder: any) => {
				folder.name = this.helperService.textTransform(folder.name) + " | folder_routes"

				if (folder.updatedDate)
					folder.lastmodified = this.helperService.formatDate(folder.updatedDate)

				if (folder.size)
					folder.size = this.helperService.convertSize(folder.size)
				else
					folder.size = '---'

				folder.format = folder.format ?? '---'
			})
			this.datatableRecord = all_folders

			this.settingDataTableProperties(response)
      this.showPagination = this.pagination.totalItems > 5;

		})
	}

	getContentList() {
		this.apiContentService.getContentList(this.pagination).subscribe((response: any) => {
			let all_content_items = response.content
			all_content_items.forEach((item: any) => {
				item.name = item.name + " | " + item.thumbLink
				item.lastmodified = item.updatedDate ? this.helperService.formatDate(item.updatedDate) : '---'
				item.size = this.helperService.convertSize(item.size) ?? '---'
				item.isChecked = false
			})
			this.datatableRecord = all_content_items;

			this.settingDataTableProperties(response);
      this.showPagination = this.pagination.totalItems > 5;
		})
	}

	settingDataTableProperties (api_response: any, reset_properties = 0) {
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

		this.reloadDataTable();
	}

	reloadDataTable(refresh_recent_items = true) {
		if (this.list_type == 'Folder') {
			this.getFolderList()
		} else {
			this.getContentList()
		}

		if (refresh_recent_items) {
			this.getRecentItems()
		}
	}

}
