import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, Input, Output, OnInit, ElementRef, EventEmitter } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiFolderService } from "src/app/core/service/api-folder.service";
import { ApiFolderContentService } from "src/app/core/service/api-folder-content.service";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { ApiScheduleService } from "src/app/core/service/api-schedule.service";
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { SharedService } from 'src/app/core/service/shared.service';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {

 isButtonEnabled: boolean = true;

	@Input() folder_data: any;

	check = true;
	folder_created_from_popup = false;
	action: string;
	dialogTitle: string;
	departmentList;
	formData;
	departmentListForm: FormGroup;
	folder_name: string;
	selected_folder_id: number
	content_item_details: any;
	selected_recent_item_data: any;
	isNewFolder: boolean;
	bulk_action_data: any;
	playlist_for_schedule: any;
	selected_playlist_id: any;
	selected_playlist_zone_ids: any;

	schedule_week_options = [
		{ label: 'Mon', checked: false },
		{ label: 'Tue', checked: false },
		{ label: 'Wed', checked: false },
		{ label: 'Thur', checked: false },
		{ label: 'Fri', checked: false },
		{ label: 'Sat', checked: false },
		{ label: 'Sun', checked: false },
	];
	schedule_name = "New Schedule"
	schedule_playlist_id: any;
	schedule_start_date: string = ''
	schedule_end_date: string = ''
	schedule_week_days: any;

	constructor(
		public dialogRef: MatDialogRef<PopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private helperService: HelperService,
		private apiContentService: ApiContentService,
		private apiFolderService: ApiFolderService,
		private apiFolderContentService: ApiFolderContentService,
		private apiPlaylistService: ApiPlaylistService,
		private apiScheduleService: ApiScheduleService,
		private apiScreenService: ApiScreenService,
		private sharedService: SharedService,
		private el: ElementRef,
		private router: Router,
		public dialog: MatDialog
	) {

		console.log("PopupComponent data: ", data)

		this.action = data.action;
		this.selected_recent_item_data = data.response_data;
		this.selected_folder_id = data.folder_id;

		if (this.action === "edit") {
			this.dialogTitle = data.departmentList.d_name;
			this.departmentList = data.departmentList;
		} else {
			this.dialogTitle = "New DepartmentList";
		}

		if(data.bulk_action_data) {
			this.bulk_action_data = JSON.parse(data.bulk_action_data);
		}

		this.folder_created_from_popup = data.folder_created_from_popup

		if (data.type == 10) {
			this.getPlayListForSchedule()
		}
	}

	group: FormGroup;
	controls: any[];

	ngOnInit() {
	}

	formControl = new FormControl("", [
		Validators.required,
	]);

	formValueChanged(data) {
		if (data.invalid) {
			this.check = true;
		} else {
			this.check = false;
		}
		this.formData = data.value;
		console.log('this.formData', this.formData)
	}

	getErrorMessage() {
		return this.formControl.hasError("required")
			? "Required field"
			: this.formControl.hasError("email")
				? "Not a valid email"
				: "";
	}

	submit() {
		// emppty stuff
		console.log('comiwnefwef')
	}

	onNoClick(): void {
		console.log('onNoClick')
		this.dialogRef.close(false);
	}

  onCloseAll(): void {
		this.dialog.closeAll();
    const popupContainer = document.querySelector('.menu_light');
      setTimeout(function(){
        popupContainer.classList.remove('increased_width_lg');
    },80);
	}

	onNoWarn(): void {
		console.log('appi')
		this.dialogRef.close(true);
	}

	onApply(): void {
		console.log('appi', this.formData)
		this.dialogRef.close(this.formData);
	}

	setFolderName(data: any): void {
		this.folder_name = data;
	}

	setFolderAddOption(data: any): void {
		this.selected_folder_id = data;
	}

	setContentPlayListID(playlist_id): void {
		console.log("setContentPlayListID playlist_id: ", playlist_id)
		this.selected_playlist_id = playlist_id;
	}

	setContentPlayListZoneIDs(playlist_zone_ids): void {
		console.log("setContentPlayListZoneIDs playlist_zone_ids: ", playlist_zone_ids)
		this.selected_playlist_zone_ids = playlist_zone_ids;
	}

	onClickAddFolderSubmit(): void {
		if (this.folder_name == '' || this.folder_name == undefined) {
			this.helperService.showToasterNotifications("Error", "Folder Name Required.");
			return
		}

		let folder_creation_detail = {
			"name": this.folder_name
		};
		this.apiFolderService.postFolderCreate(folder_creation_detail).subscribe((response: any) => {
			console.log('postFolderCreate', response)
			this.dialogRef.close(false);
			console.log("this.folder_created_from_popup: ", this.folder_created_from_popup)
			if (this.folder_created_from_popup) {
				this.sharedService.setTriggerOfFolderCreated(response);
			} else {
				this.router.navigate(["/admin/dashboard/content-module/folder/" + response.id]);
			}
		})
	}

	onClickRenameSubmit(): void {
		console.log("onClickRenameSubmit: ", this.selected_recent_item_data)
		let current_item_record = this.selected_recent_item_data;

		let item_update_detail = {
			"id": this.selected_recent_item_data.id,
			"name": this.folder_name
		};

		if (current_item_record.parentFolderId !== undefined) {

			if (this.folder_name == '' || this.folder_name == undefined) {
				this.helperService.showToasterNotifications("Error", "Folder Name Required.");
				return
			}

			this.apiFolderService.postFolderUpdate(item_update_detail).subscribe((response: any) => {
				this.dialogRef.close(false);

				if (response) {
					this.helperService.showToasterNotifications("Success", "Folder Updated Successfully");
				} else {
					this.helperService.showToasterNotifications("Error", "Folder Not Updated");
				}
			})
		} else {

			if (this.folder_name == '' || this.folder_name == undefined) {
				this.helperService.showToasterNotifications("Error", "Content Name Required.");
				return
			}

			this.apiContentService.putContentUpdate(item_update_detail).subscribe((response: any) => {
				this.dialogRef.close(false);

				if (response) {
					this.helperService.showToasterNotifications("Success", "Content Updated Successfully");
				} else {
					this.helperService.showToasterNotifications("Error", "Content Not Updated");
				}
			})

		}
		return
	}

	onClickDeleteSubmit(): void {
		console.log("onClickDeleteSubmit:", this.data)

		var record_ids;
		if(this.bulk_action_data && this.bulk_action_data.selected_record_ids.length) {
			record_ids = this.bulk_action_data.selected_record_ids
		} else {
		 	record_ids = [this.selected_recent_item_data.id];
		}
		console.log("records_ids: ", record_ids, ' - ', this.data.module);

		if (this.data.module == "playlist" || this.data.module == "schedule" || this.data.module == "screen") {
			this.deleteItems(record_ids, this.data.module);
		} else {
			if (this.data.list_type == "Content") {
				this.deleteContentItems(record_ids);
			} else if (this.data.list_type == "Folder") {
				this.deleteFolders(record_ids);
			}
		}
	}

	onClickAddToPlaylistSubmit(event: Event): void {
		if (this.selected_playlist_id == undefined) {
			this.helperService.showToasterNotifications("Warning", "Please Select Playlist and its respective zone(s)");
			return
		}

		if (this.selected_playlist_zone_ids == undefined || this.selected_playlist_zone_ids.length == 0) {
			this.helperService.showToasterNotifications("Warning", "Please Select Playlist Zone(s)");
			return
		}

		let playlist_object_from_localstorage = this.helperService.getObjectFromLocatStorage('content_playlist_object')
		console.log("playlist_object_from_localstorage: ", playlist_object_from_localstorage)

		this.selected_playlist_zone_ids.forEach((selected_zone: any) => {

			let current_duration = this.helperService.getDurationForPlaylistContent(this.selected_recent_item_data)
			const selected_zone_index = playlist_object_from_localstorage.zones.findIndex(zone => zone.id == selected_zone);

			if (selected_zone_index !== -1) {

				let playlist_zone_contents_length = 0
				let playlist_zone_content_ordinal = 0
				let playlist_zone_next_content_ordinal = 0;

				let next_content = {
					"id": 0,
					"playlistZoneId": 0,
					"duration": current_duration,
					"ordinal": playlist_zone_next_content_ordinal,
					"contentId": this.selected_recent_item_data.id,
				}

				let content_with_details_format: any = [
					{
						"id": this.selected_recent_item_data.id,
						"name": this.selected_recent_item_data.name,
						"format": this.selected_recent_item_data.format,
						"contentType": this.selected_recent_item_data.contentType,
						"permaLink": this.selected_recent_item_data.permaLink,
						"thumbLink": this.selected_recent_item_data.thumbLink,
						"size": this.selected_recent_item_data.size,
						"assetSourceType": this.selected_recent_item_data.assetSourceType,
						"organizationId": this.selected_recent_item_data.organizationId,
						"locationId": this.selected_recent_item_data.locationId,
						"createdBy": this.selected_recent_item_data.createdBy,
						"updatedBy": this.selected_recent_item_data.updatedBy,
						"createdDate": this.selected_recent_item_data.createdDate,
						"updatedDate": this.selected_recent_item_data.updatedDate,
						"duration": 5,
						"ordinal": playlist_zone_next_content_ordinal
					}
				]

				if (playlist_object_from_localstorage.zones[selected_zone_index].contents != undefined) {

					playlist_zone_contents_length = playlist_object_from_localstorage.zones[selected_zone_index].contents.length
					playlist_zone_content_ordinal = playlist_object_from_localstorage.zones[selected_zone_index].contents[playlist_zone_contents_length - 1].ordinal
					playlist_zone_next_content_ordinal = playlist_zone_content_ordinal + 1

					next_content.ordinal = playlist_zone_next_content_ordinal
					content_with_details_format.ordinal = playlist_zone_next_content_ordinal

					playlist_object_from_localstorage.zones[selected_zone_index].contents.push(next_content);
					playlist_object_from_localstorage.zones[selected_zone_index].contentsWithDetails.push(content_with_details_format);

				} else {
					playlist_object_from_localstorage.zones[selected_zone_index].contents = [next_content];
					playlist_object_from_localstorage.zones[selected_zone_index].contentsWithDetails = [content_with_details_format];
				}

				playlist_object_from_localstorage.zones[selected_zone_index].duration += current_duration
				this.helperService.saveObjectInLocatStorage('content_playlist_object', playlist_object_from_localstorage)
			}
		});


		this.apiPlaylistService.putPlaylistUpdate(playlist_object_from_localstorage).subscribe((response: any) => {
			this.dialogRef.close(false);

			if (response) {
				this.helperService.showToasterNotifications("Success", "Content Successfully Added to PlayList " + playlist_object_from_localstorage.name);
			} else {
				this.helperService.showToasterNotifications("Error", "Content Not Added to PlayList " + playlist_object_from_localstorage.name);
			}
			this.helperService.removeObjectFromLocatStorage('content_playlist_object')
		})
	}

	deleteItems (delete_record_ids, module_name) {

		if (module_name == "playlist") {
			let playlist_ids = {'playlistIds' : delete_record_ids}

			this.apiPlaylistService.deletePlaylist(playlist_ids).subscribe((response: any) => {
				console.log("response: ", response)
				this.dialogRef.close(false);
				response.forEach((item: any) => {
					if(item.deleted) {
						this.helperService.showToasterNotifications("Success", item.message);
					} else {
						this.helperService.showToasterNotifications("Error", item.message);
					}
				});
				this.sharedService.setTriggerOfContentDeletion(response)
			})
		} else if (module_name == "schedule") {
			let record_ids = {'scheduleIds' : delete_record_ids}

			this.apiScheduleService.deleteSchedule(record_ids).subscribe((response: any) => {
				console.log("response: ", response)
				this.dialogRef.close(false);
				response.forEach((item: any) => {
					if(item.deleted) {
						this.helperService.showToasterNotifications("Success", item.message);
					} else {
						this.helperService.showToasterNotifications("Error", item.message);
					}
				});
				this.sharedService.setTriggerOfContentDeletion(response)
			})
		} else if (module_name == "screen") {
			let record_ids = {'screenIds' : delete_record_ids}

			this.apiScreenService.deleteScreen(record_ids).subscribe((response: any) => {
				console.log("response: ", response)
				this.dialogRef.close(false);
				response.forEach((item: any) => {
					if(item.deleted) {
						this.helperService.showToasterNotifications("Success", item.message);
					} else {
						this.helperService.showToasterNotifications("Error", item.message);
					}
				});
				this.sharedService.setTriggerOfContentDeletion(response)
			})
		}

	}

	deleteContentItems (record_ids) {
		let content_ids = {'contentIds' : record_ids}
		this.apiContentService.deleteContentItem(content_ids).subscribe((response: any) => {
			console.log("response: ", response)
			this.dialogRef.close(false);
			response.forEach((item: any) => {
				if(item.deleted) {
					this.helperService.showToasterNotifications("Success", "Content Deleted Successfully");
				} else {
					this.helperService.showToasterNotifications("Error", item.message);
				}
			});
			this.sharedService.setTriggerOfContentDeletion(response)
		})
	}

	deleteFolders (record_ids) {
		let content_ids = {'folderIds' : record_ids}
		this.apiFolderService.deleteFolder(content_ids).subscribe((response: any) => {
			console.log("response: ", response)
			this.dialogRef.close(false);
			response.forEach((item: any) => {
				if(item.deleted) {
					this.helperService.showToasterNotifications("Success", "Folder Deleted Successfully");
				} else {
					this.helperService.showToasterNotifications("Error", item.message);
				}
			});
			this.sharedService.setTriggerOfContentDeletion(response)
		})
	}

	onClickRemoveSubmit(): void {
		console.log("onClickRemoveSubmit: ", this.bulk_action_data)

		var record_ids;
		if(this.bulk_action_data && this.bulk_action_data.selected_record_ids.length) {
			record_ids = this.bulk_action_data.selected_record_ids
		} else {
		 	record_ids = [this.selected_recent_item_data.id];
		}
		console.log("record_ids: ", record_ids)

		let content_ids = {
			"contentIds": record_ids
		};

		this.apiFolderContentService.removeContentFromFolder(this.selected_folder_id, content_ids).subscribe((response: any) => {
			this.dialogRef.close(false);

			if (response) {
				this.helperService.showToasterNotifications("Success", "Content Removed Successfully");
			} else {
				this.helperService.showToasterNotifications("Error", "Content Not Removed");
			}

			this.sharedService.setTriggerOfContentDeletion(response)
		})
	}

	onAddToItemSubmit(): void {
		console.log("onAddToItemSubmit: ", this.bulk_action_data)
		if (this.selected_folder_id == undefined) {
			this.helperService.showToasterNotifications("Warning", "Please Select Folder to Move Content(s)");
			return
		}

		var record_ids;
		if(this.bulk_action_data && this.bulk_action_data.selected_record_ids.length) {
			record_ids = this.bulk_action_data.selected_record_ids
		} else {
		 	record_ids = [this.selected_recent_item_data.id];
		}
		console.log("record_ids: ", record_ids)

		let content_add_details = {
			"contentIds": record_ids
		};

		this.apiFolderContentService.addContentToFolder(this.selected_folder_id, content_add_details).subscribe((response: any) => {
			console.log('addContentToFolder', response)
			this.dialogRef.close(false);

			if (response) {
				this.helperService.showToasterNotifications("Success", "Content Added to Folder Successfully");
			} else {
				this.helperService.showToasterNotifications("Error", "Content Not Added");
			}
		})
	}

	getPlayListForSchedule() {
		this.apiPlaylistService.getPlaylistListWithoutPagination().subscribe((response: any) => {
			console.log("apiPlaylistService: ", response)
			this.playlist_for_schedule = response
		});
	}

	onEditschedule() {
		const element = this.el.nativeElement.querySelector('#edit_schedule_name');
		const getplayListName = this.el.nativeElement.querySelector('.scheduleName').innerText;
		if (element) {
			element.style.display = 'block';
			element.focus();
			element.value = getplayListName;
			this.el.nativeElement.querySelector('.scheduleName').style.display = 'none';
			this.el.nativeElement.querySelector('.edit_schedule_btn').style.display = 'none';
			this.el.nativeElement.querySelector('.update_schedule_name').style.display = 'block';
		}
	}

	onUpdatescheduleName() {
		const element = this.el.nativeElement.querySelector('#edit_schedule_name');
		if (element.value.length > 0) {
			this.el.nativeElement.querySelector('.edit_schedule_btn').style.display = 'block';
			this.el.nativeElement.querySelector('.update_schedule_name').style.display = 'none';
			element.style.display = "none";
			this.el.nativeElement.querySelector('.scheduleName').style.display = 'block';
			this.el.nativeElement.querySelector('.scheduleName').innerText = element.value;

			this.schedule_name = element.value
            this.sharedService.setScheduleNameToSave(this.schedule_name)
		}
	}

	onSelectPlaylistFromDD(event: MatSelectChange): void {
		console.log("onSelectPlaylistFromDD: ", event.value);
		this.schedule_playlist_id = event.value
		this.sharedService.setSchedulePlayListToSave(this.schedule_playlist_id)
	}

	onChangeScheduleStartDate(event: any): void {
		console.log("onChangeScheduleStartDate event: ", event.target.value);
		this.schedule_start_date = event.target.value
		this.sharedService.setScheduleDateToSave(this.schedule_start_date, this.schedule_end_date)
	}


	onChangeScheduleEndDate(event: any): void {
		console.log("onChangeScheduleEndDate event: ", event.target.value);
		this.schedule_end_date = event.target.value
		this.sharedService.setScheduleDateToSave(this.schedule_start_date, this.schedule_end_date)
	}

	onSelectScheduleWeekDays(): void {
		this.schedule_week_days = this.schedule_week_options
		  .filter(option => option.checked)
		  .map(option => option.label);

		console.log("this.schedule_week_days: ", this.schedule_week_days)
		this.sharedService.setScheduleWeekDays(this.schedule_week_days)
	}

	onAddScreens() {
		console.log("popup component --- onAddScreens")
        this.helperService.loadSelectScreenPopup()
	}

	onSelectScreens() {
		console.log("onSelectScreens: ")
		this.sharedService.setTriggerOfSetSelectedDatatableRecordIds("screen_ids");
	}

	onSelectPlaylist() {
		console.log("onSelectPlaylist: ")
		var selected_playlist = this.sharedService.getSchedulePlayListObject();
		this.sharedService.setSchedulePlayListToSave(selected_playlist.id)
		this.helperService.showToasterNotifications('success', 'PlayList ' + selected_playlist.name + ' Selected')
		this.dialogRef.close(false);
	}

	onClickSaveSchedule() {
		console.log('onClickSaveSchedule')
        let schedule_data = this.sharedService.getScheduleRecordToSave()
		this.apiScheduleService.postScheduleCreate(schedule_data).subscribe((response: any) => {
            console.log("response: ", response)
            if (response) {
                this.helperService.showToasterNotifications('success', 'Schedule saved suceesfully')
				this.dialogRef.close(false);
            }
        })
	}

	onAddNewFolder() {
        const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				folder_created_from_popup: true,
				title: 'Create Folder',
				action: "Create",
				value: '',
				type: '7'
			},
			direction: 'ltr',
		});
    }
  onRadioButtonSelected(event: boolean) {
    this.isButtonEnabled = false; // Enable the button when a radio button is selected
  }

}
