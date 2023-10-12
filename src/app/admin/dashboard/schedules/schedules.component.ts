import { Component, Inject, HostListener,ViewChild,ElementRef,ChangeDetectorRef  } from '@angular/core';
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { ApiScheduleService } from "src/app/core/service/api-schedule.service";
import { SharedService } from "src/app/core/service/shared.service";
import { HelperService } from "src/app/core/service/helper.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'select2';

@Component({
	selector: 'app-schedules',
	templateUrl: './schedules.component.html',
	styleUrls: ['./schedules.component.scss'],
   animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1
      })),
      state('out', style({
        height: '0px',
        opacity: 0
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ])
  ]
})

export class SchedulesComponent {
  @ViewChild('startDateInput') startDateInput: ElementRef;
  @ViewChild('endDateInput') endDateInput: ElementRef;
  @ViewChild('screenSelect') screenSelect: ElementRef;
  @ViewChild('playlistSelect') playlistSelect: ElementRef;
  showFilters: boolean = false;
  showClearButton: boolean = false;
	isMobileScreenSize: boolean;
	search_placeholder_text = "Search for schedular names"
	playlist_dropdown: any;
	screenlist_dropdown: any;

	from_date: string = '';
	to_date: string = '';
	selected_screen_id: string = '';
	selected_playlist_id: string = '';

	pagination = {
		totalPage: 0,
		pageNumber: 0,
		pageSize: 5,
		totalItems: 0,

		from_date: '',
		to_date: '',
		selected_screen_id: '',
		selected_playlist_id: '',

		pageSizeOptions: [5, 10, 20],
		sortBy: 'updatedDate',
		sortOrder: 'DESC',
		contentType: 'ALL'
	}

	datatableRecord = [];

	datatableColumns = [
		{ name: 'Name', field: 'name', sortable: true },
		{ name: 'Screens', field: 'screen', sortable: false }
	];

	datatableActions = [
		{ label: 'Edit', action: this.onEditList.bind(this) },
		{ label: 'Delete', action: this.onDeleteRow.bind(this) },
	];

	check_all_drop_down_actions: any[] = [
		{ title: 'Delete All' },
	];

	constructor(
		private dialog: MatDialog,
		private apiPlaylistService: ApiPlaylistService,
		private apiScreenService: ApiScreenService,
		private apiScheduleService: ApiScheduleService,
		private helperService: HelperService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
		private router: Router,
    private cdr: ChangeDetectorRef,
	) {
		this.sharedService.setModuleType('schedule')
		this.helperService.removeObjectFromLocatStorage('selected_screens')
	}

	ngOnInit() {
		console.log("ngOnInit Schedule Module: ")
		this.sharedService.setTriggerOfSearchPlaceHolderText(this.search_placeholder_text)
		this.isMobileScreenSize = window.innerWidth <= 992;
		this.getScheduleList()
		this.getPlayListForSchedule()
		this.getScreenListForSchedule()
		$('#screenSelect').select2({
			placeholder: "Select Screen",
		});

		$('#playlistSelect').select2({
			placeholder: "Select Playlist",
		});
	}

	@HostListener('window:resize', ['$event'])
	@HostListener('window:load', ['$event'])
	onResize(event: any) {
		this.isMobileScreenSize = window.innerWidth <= 1200;
	}
 ngAfterViewInit() {
  	$('#screenSelect').select2({
			placeholder: "Select Screen",
		});

		$('#playlistSelect').select2({
			placeholder: "Select Playlist",
		});
 }
	onFromDateChange(event: Event) {
		const selectedDate = (event.target as HTMLInputElement).value;
		this.from_date = selectedDate
		this.pagination.from_date = this.from_date
	}

	onToDateChange(event: Event) {
		const selectedDate = (event.target as HTMLInputElement).value;
		this.to_date = selectedDate
		this.pagination.to_date = this.to_date
	}

	onSearchBtnClick() {
		this.selected_screen_id = $('#screenSelect').val();
		this.pagination.selected_screen_id = this.selected_screen_id

		this.selected_playlist_id = $('#playlistSelect').val();
		this.pagination.selected_playlist_id = this.selected_playlist_id

		this.getScheduleList();
    this.showClearButton = true;
    this.getScheduleList();
	}

	onEditList(row: any) {
		if(!this.isMobileScreenSize){
			this.router.navigate(['/admin/dashboard/schedules/edit', row.id]);
		}

		if(this.isMobileScreenSize){
			this.sharedService.setModuleSearchType('schedule')
			const popupContainer = document.querySelector('.menu_light');
			if (popupContainer) {
				popupContainer.classList.add('increased_width');
			}
			const dialogRef = this.dialog.open(PopupComponent, {
				data: {
					module: 'screens',
					title: 'Screen Selection',
					showSearchbar: false,
					action: "Save",
					value: '',
					type: '10'
				},
				direction: 'ltr',
			});
			dialogRef.afterClosed().subscribe((result) => {
				popupContainer.classList.remove('increased_width');
			});
		}
	}

	onDeleteRow(row: any) {
		var text_to_show = 'Are you sure, you want to delete this Schedular?'
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'schedule',
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
			this.getScheduleList()
		});
	}

	getScheduleList() {
		this.apiScheduleService.getScheduleList(this.pagination).subscribe((response: any) => {
			let all_screens = response.content
			all_screens.forEach((screen: any) => {
				screen.screen = screen.screenNames ?? ''
				screen.isChecked = false
			})
			this.datatableRecord = all_screens;

			this.settingDataTableProperties(response)
		})
	}

	getPlayListForSchedule() {
		this.apiPlaylistService.getPlaylistListWithoutPagination().subscribe((response: any) => {
			console.log("apiPlaylistService: ", response)
			this.playlist_dropdown = response
		});
	}

	getScreenListForSchedule() {
		this.apiScreenService.getSearchScreenList('').subscribe((response: any) => {
			console.log("apiScreenService: ", response)
			this.screenlist_dropdown = response
		})
	}

	settingDataTableProperties(api_response: any, reset_properties = 0) {
		// setting datatable operation related stuff
		if (reset_properties == 1) {
			this.pagination = {
				totalPage: 0,
				pageNumber: 0,
				pageSize: 5,
				totalItems: 0,

				from_date: '',
				to_date: '',
				selected_screen_id: '',
				selected_playlist_id: '',

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

		this.getScheduleList();
	}

	receiveDatatableOperation(datatable_operation_details: any) {
		console.log("receiveDatatableOperation: ", datatable_operation_details)
		this.pagination.sortBy = (datatable_operation_details.active != "screen") ? datatable_operation_details.active : 'screenNames'
		this.pagination.sortOrder = datatable_operation_details.direction

		this.getScheduleList();
	}

	receiveActionType(bulk_action_record: string) {
		console.log("receiveActionType: ", JSON.parse(bulk_action_record))
		let receive_data = JSON.parse(bulk_action_record);
		if (receive_data.bulk_action_type == "Delete All") {
			this.DeleteBulkContent(bulk_action_record);
		}
	}

	DeleteBulkContent (bulk_action_record) {
		var text_to_show = 'Are you sure, you want to delete all the Schdeulars selected?'

		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				module: 'schedule',
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
			this.getScheduleList();
		});
	}

	navigateToSchedule() {
		this.router.navigate(['admin/dashboard/schedules/view']); // Navigate to the 'schedule' route
	}
  onClearAllClick() {
    this.startDateInput.nativeElement.value = '';
    this.endDateInput.nativeElement.value = '';
    $(this.screenSelect.nativeElement).val(null).trigger('change');
    $(this.playlistSelect.nativeElement).val(null).trigger('change');
    this.pagination.from_date = '';
    this.pagination.to_date = '';
    this.pagination.selected_screen_id = '';
    this.pagination.selected_playlist_id = '';
    this.showClearButton = false;
    // Trigger the "Submit" action to reload all data without filters
    this.getScheduleList();
  }
   toggleFilterVisibility() {
        this.showFilters = !this.showFilters;
        this.cdr.detectChanges();
         if (!this.showFilters) {
            // If filters are hidden, destroy Select2 to prevent issues
            $('#screenSelect').select2('destroy');
            $('#playlistSelect').select2('destroy');
        } else {
            // If filters are shown again, reinitialize Select2
            $('#screenSelect').select2({
                placeholder: "Select Screen"
            });

            $('#playlistSelect').select2({
                placeholder: "Select Playlist"
            });
        }
    }
}
