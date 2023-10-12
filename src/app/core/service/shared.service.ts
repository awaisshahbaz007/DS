import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

	@Output() file_uploaded = new EventEmitter<boolean>();
	@Output() folder_created = new EventEmitter<boolean>();
	@Output() content_delete = new EventEmitter<boolean>();
	@Output() search_placeholder_text = new EventEmitter<boolean>();
	@Output() popup_search_placeholder_text = new EventEmitter<boolean>();
  @Output() playlist_preview_screens = new EventEmitter<boolean>();
  @Output() keyup_location_screens = new EventEmitter<boolean>();
	@Output() selected_datatable_records_trigger = new EventEmitter<string>();
	@Output() schedule_selected_screens = new EventEmitter<boolean>();
	@Output() schedule_selected_playlist = new EventEmitter<any>();
	@Output() update_popup_screen_list = new EventEmitter<any>();
	@Output() update_popup_playlist = new EventEmitter<any>();

    private schedulePlayListObj: any;
    private folderID: any;
    private tempLayoutId: any;
    private module_name: string;
    private module_search_name: string;
    private isButtonDisabledSubject = new BehaviorSubject<boolean>(true);
    isButtonDisabled$ = this.isButtonDisabledSubject.asObservable();
    private schedule_object: any = {
        "id": '',
        "name": "",
        "startDateTime": "",
        "endDateTime": "",
        "monday": false,
        "tuesday": false,
        "wednesday": false,
        "thursday": false,
        "friday": false,
        "saturday": false,
        "sunday": false,
        "schedulePlaylistId": '',
        "scheduleScreenIds": []
    }

    private screen_object: any = {
        "id": '',
        "name": '',
        "orientation": '',
        "placedAt": '',
    }

    constructor() { }

    getFolderIDValue(): any {
        return this.folderID;
    }

    setFolderIDValue(folder_id: number): void {
        console.log("setFolderIDValue folder_id : ", folder_id)
        this.folderID = folder_id;
    }

    getTempLayoutID(): any {
        return this.tempLayoutId;
    }

    setTempLayoutID(temp_layout_id: string): void {
        console.log("setTempLayoutID temp_layout_id : ", temp_layout_id)
        this.tempLayoutId = temp_layout_id;
    }

    setSchedulePlayListObject(playlist_obj: string): void {
        console.log("setSchedulePlayListObject playlist_obj : ", playlist_obj)
        this.schedulePlayListObj = playlist_obj;
    }

    getSchedulePlayListObject(): any {
        return this.schedulePlayListObj;
    }

    setTriggerOfFileUpload(file_upload): void {
        console.log("setTriggerOfFileUpload file_upload : ", file_upload)
        this.file_uploaded.emit(file_upload);
    }

    setTriggerOfFolderCreated(folder): void {
        console.log("setTriggerOfFolderCreated folder : ", folder)
        this.folder_created.emit(folder);
    }

    setTriggerOfContentDeletion(resposne): void {
        console.log("setTriggerOfContentDeletion folder : ", resposne)
        this.content_delete.emit(resposne);
    }

    setScheduleNameToSave(name: string): void {
        this.schedule_object.name = name
    }

    setScheduleDateToSave(start_date_time: string, end_data_time: string): void {
        this.schedule_object.startDateTime = start_date_time
        this.schedule_object.endDateTime = end_data_time
    }

    setScheduleWeekDays(schedule_week_days): void {
        this.schedule_object.monday = schedule_week_days.includes("Mon")
        this.schedule_object.tuesday = schedule_week_days.includes("Tue")
        this.schedule_object.wednesday = schedule_week_days.includes("Wed")
        this.schedule_object.thursday = schedule_week_days.includes("Thur")
        this.schedule_object.friday = schedule_week_days.includes("Fri")
        this.schedule_object.saturday = schedule_week_days.includes("Sat")
        this.schedule_object.sunday = schedule_week_days.includes("Sun")
    }

    setSchedulePlayListToSave(schedule_playlist_id: string): void {
        this.schedule_object.schedulePlaylistId = schedule_playlist_id
        this.schedule_selected_playlist.emit(this.schedulePlayListObj);

        this.getScheduleRecordToSave()
    }

    setScheduleScreensToSave(schedule_screen_ids: any): void {
        this.schedule_object.scheduleScreenIds = schedule_screen_ids
    }

    setScheduleWeekRecordToSave(week_days): void {
        // this.schedule_object.scheduleScreenIds = week_days
    }

    getScheduleRecordToSave(): any {
        console.log("getScheduleRecordToSave this.schedule_object: ", this.schedule_object)
        return this.schedule_object;
    }

    setModuleType(module: string): void {
        this.module_name = module
    }

    getModuleType(): string {
        return this.module_name;
    }

    setModuleSearchType(module: string): void {
        this.module_search_name = module
    }

    getModuleSearchType(): string {
        return this.module_search_name
    }

    setScreenObjectId(screen_id): void {
        this.screen_object.id = screen_id
    }

    setScreenObjectName(screen_name): void {
        this.screen_object.name = screen_name
    }

    TriggersetScreenObjectLocation(preview: boolean = false): void {
        this.keyup_location_screens.emit(preview);
    }

    getScreenObjectName(): string {
        return this.screen_object.name
    }

    setScreenObjectOrientation(screen_orientation): void {
        this.screen_object.orientation = screen_orientation
    }

    setScreenObjectLocation(screen_location): void {
        this.screen_object.placedAt = screen_location
    }

    getScreenRecordToSave(): any {
        return this.screen_object;
    }

    setTriggerOfSearchPlaceHolderText(search_placeholder_text): void {
        this.search_placeholder_text.emit(search_placeholder_text);
    }

    setTriggerOfPopupSearchPlaceHolderText(popup_search_placeholder_text): void {
        console.log("setTriggerOfPopupSearchPlaceHolderText: ", popup_search_placeholder_text)
        this.popup_search_placeholder_text.emit(popup_search_placeholder_text);
    }

    setTriggerOfSetSelectedDatatableRecordIds(record_type: string): void {
        console.log("setTriggerOfSetSelectedDatatableRecordIds: ", record_type)
        this.selected_datatable_records_trigger.emit(record_type);
    }

    TriggerScheduleOfSetSelectedScreen(): void {
        this.schedule_selected_screens.emit();
    }

    TriggerPlaylistOfSelectedScreen(preview: boolean = false): void {
        this.playlist_preview_screens.emit(preview);
    }

    setTriggerToUpdateScreenTableList(screen_search_result): void {
        this.update_popup_screen_list.emit(screen_search_result);
    }

    setTriggerToUpdatePopupPlayList(playlist_search_result): void {
        this.update_popup_playlist.emit(playlist_search_result);
    }
    setButtonState(isDisabled: boolean) {
      this.isButtonDisabledSubject.next(isDisabled);
    }
}
