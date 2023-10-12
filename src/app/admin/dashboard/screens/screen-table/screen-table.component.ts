import { Component, Inject } from '@angular/core';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { SharedService } from "src/app/core/service/shared.service";
import { HelperService } from "src/app/core/service/helper.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'app-screen-table',
	templateUrl: './screen-table.component.html',
	styleUrls: ['./screen-table.component.scss']
})

export class ScreenTableComponent {

	search_placeholder_text = "Search for screen names"
	isMobileScreenSize: boolean;

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
	datatableRecord = [];
	datatableColumns = [
		{ name: 'Screen NAME', field: 'name', sortable: true },
		{ name: 'Location', field: 'location', sortable: true },
    { name: 'Status', field: 'status', sortable: true }
	];
	datatableActions = [
		{ label: 'Edit Screen', action: this.onEditScreen.bind(this) },
		{ label: 'Select Schedule', action: this.onSelectSchedule.bind(this) },
		// { label: 'Setting', action: this.onSettings.bind(this) },
		// { label: 'Clear Cache', action: this.onClearCache.bind(this) },
		// { label: 'Refresh', action: this.onRefreshRow.bind(this) },
		{ label: 'Delete', action: this.onDeleteScreen.bind(this) },
	];
	check_all_drop_down_actions: any[] = [
		{ title: 'Delete All' },
	];

	constructor(
		private dialog: MatDialog,
		private apiScreenService: ApiScreenService,
		private helperService: HelperService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
		private router: Router
	) {
		this.sharedService.setModuleType('screens')
	}

	ngOnInit() {
		console.log("ngOnInit Screens Module: ")
		this.sharedService.setTriggerOfSearchPlaceHolderText(this.search_placeholder_text)
		this.isMobileScreenSize = window.innerWidth <= 992;
		this.getScreenList()
	}

	getScreenList() {
		this.apiScreenService.getScreenList(this.pagination).subscribe((response: any) => {
			let all_screens = response.content
			console.log("all_screens: ", all_screens)
			if (all_screens.length < 1) {
				this.router.navigate(["/admin/dashboard/screens/no_paired"]);
			}

			all_screens.forEach((screen: any) => {
				screen.name = screen.name ?? '-----'
				screen.location = screen.placedAt ?? '-----'
				screen.isChecked = false
			})
			this.datatableRecord = all_screens;

			this.settingDataTableProperties(response)
		})
	}

	onEditScreen(row: any) {
		console.log('Edit row:', row);
		this.router.navigate(["/admin/dashboard/screens/screen_orientation/" + row.id]);
	}

	onDeleteScreen(row: any) {
		var text_to_show = 'Are you sure, you want to delete this Screen?'
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'screen',
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
			this.getScreenList()
		});
	}

	onSelectSchedule(row: any) {
		const selected_screen = [row.id];
		this.helperService.saveObjectInLocatStorage('selected_screens', selected_screen);
		let selected_screen_ids = this.helperService.getObjectFromLocatStorage('selected_screens');
		this.router.navigate(["/admin/dashboard/schedules/create"]);
	}

	onClearCache(row: any) {
		console.log('Edit row:', row);
	}
	onSettings(row: any) {
		console.log('Edit row:', row);
	}
	onRefreshRow(row: any) {
		console.log('Edit row:', row);
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

		this.getScreenList();
	}

	receiveDatatableOperation(datatable_operation_details: any) {
		console.log("receiveDatatableOperation: ", datatable_operation_details)
		this.pagination.sortBy = (datatable_operation_details.active != "screen") ? datatable_operation_details.active : 'screenNames'
		this.pagination.sortOrder = datatable_operation_details.direction

		this.getScreenList();
	}

	receiveActionType(bulk_action_record: string) {
		console.log("receiveActionType: ", JSON.parse(bulk_action_record))
		let receive_data = JSON.parse(bulk_action_record);
		if (receive_data.bulk_action_type == "Delete All") {
			this.DeleteBulkContent(bulk_action_record);
		}
	}

	DeleteBulkContent (bulk_action_record) {
		var text_to_show = 'Are you sure, you want to delete all the Screens selected?'

		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'screen',
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
			this.getScreenList();
		});
	}
}
