import { Component, AfterViewInit, ViewChild, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HelperService } from "src/app/core/service/helper.service";
import { EventInput } from '@fullcalendar/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { ApiScheduleService } from "src/app/core/service/api-schedule.service";
import { SharedService } from "src/app/core/service/shared.service";
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-schedules',
    templateUrl: './new-schedules.component.html',
    styleUrls: ['./new-schedules.component.scss']
})

export class NewSchedulesComponent {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    schedule_id: any;
    schedule_name = "New Schedule"
    selectedDate: Date = new Date();
    isMobileScreenSize: boolean;
    isCollapsed: boolean = false;
    SelectedScreens: any = [];
    selectedPlayList: any;
    selected_playlist_name: string = 'New Playlist';
    selectEvent_id: string;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        initialDate: this.selectedDate,
        selectable: true,
        dayHeaderFormat: {
            month: 'short', day: 'numeric'
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth'
        },
        views: {
            timeGridWeek: {
                type: 'timeGridWeek',
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
            },
            timeGridDay: {
                type: 'timeGridDay',
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
            },
            dayGridMonth: {
                type: 'dayGridMonth',
                titleFormat: { year: 'numeric', month: 'long',  day: 'numeric' }
            }
        },
        select: this.handleDateSelect.bind(this),
        eventContent: this.customizeEventContent.bind(this),
        events: [],
    };

    constructor(
        private el: ElementRef,
        private router: Router,
        public dialog: MatDialog,
		private apiScreenService: ApiScreenService,
		private apiScheduleService: ApiScheduleService,
		private helperService: HelperService,
		private sharedService: SharedService,
        private location: Location,
        private route: ActivatedRoute,
    ) {
        setTimeout(() => {
            this.route.params.subscribe(params => {
                this.schedule_id = params['id']; // Assuming the route parameter is named 'id'
                if (this.schedule_id) {
                    this.apiScheduleService.getScheduleDetails(this.schedule_id).subscribe((response: any) => {
                        console.log("schedule_details response: ", response)
                        const schedule_details_obj = [{
                            id: response.id,
                            title: response.schedulePlaylist.name,
                            start: response.startDateTime,
                            end: response.endDateTime,
                        }]
                        this.calendarOptions.events = schedule_details_obj

                        this.schedule_name = response.name
                        const selected_screens = response.scheduleScreens.map(obj => obj.screenId);

                        this.sharedService.setScheduleNameToSave(this.schedule_name)
                        this.sharedService.setScheduleScreensToSave(selected_screens)
                        this.sharedService.setScheduleDateToSave(response.startDateTime, response.endDateTime)
                        this.sharedService.setSchedulePlayListToSave(response.schedulePlaylist.id)
                        this.sharedService.setSchedulePlayListObject(response.schedulePlaylist)

                        this.getSelectedScreenDetails(selected_screens)
                    })
                } else {
                    let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')
                    if (!selected_screens || selected_screens.length < 1) {
                        this.location.back();
                    }
                    console.log("selected_screens: ", selected_screens)
                    this.getSelectedScreenDetails(selected_screens)

                    this.sharedService.setScheduleNameToSave(this.schedule_name)
                    this.sharedService.setScheduleScreensToSave(selected_screens)
                }
            });
        }, 500);
    }

    ngOnInit() {
		console.log("ngOnInit NewSchedulesComponent: ")
        this.sharedService.schedule_selected_screens.subscribe(
			(schedule_screens) => {
                let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')
                const calendarApi = this.calendarComponent.getApi();
                const eventObj = calendarApi.getEventById(''+this.selectEvent_id+'');
                if (eventObj) {
                    eventObj.setProp('title', 'test');
                }
                this.getSelectedScreenDetails(selected_screens)
			}
		)

        this.sharedService.schedule_selected_playlist.subscribe(
			(selected_playlist) => {
				console.log("schedule_selected_playlist : ", selected_playlist)
                this.selectedPlayList = selected_playlist
                // this.selected_playlist_name = selected_playlist.name
            }
        )

	}

    getSelectedScreenDetails(screen_ids) {
        this.apiScreenService.getSelectedScreenList(screen_ids).subscribe((response: any) => {
			this.SelectedScreens = response;
		})
    }

    dateFormat(inputDate, format) {
        const date = new Date(inputDate);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        format = format.replace("MM", month.toString().padStart(2, "0"));

        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2, 2));
        }

        format = format.replace("dd", day.toString().padStart(2, "0"));

        return format;
    }

    customizeEventContent(arg: any): any {
        const eventElement = document.createElement('div');
        eventElement.classList.add('custom-event');

        const ElementButtonWrap = document.createElement('div');
        ElementButtonWrap.classList.add('button_event_wrap');
        eventElement.appendChild(ElementButtonWrap);

        const wrapTextElement = document.createElement('div');
        const titleElement = document.createElement('div');
        titleElement.classList.add('event-name');
        titleElement.textContent = arg.event.title;
        wrapTextElement.appendChild(titleElement);

        const DeletebuttonElement = document.createElement('button');
        DeletebuttonElement.textContent = '';
        DeletebuttonElement.addEventListener('click', () => this.handleCustomButtonClick(arg.event));
        ElementButtonWrap.appendChild(DeletebuttonElement);

        const AddPlaylistbuttonElement = document.createElement('button');
        AddPlaylistbuttonElement.textContent = 'Add playlist';
        AddPlaylistbuttonElement.addEventListener('click', () => this.AddPlaylistClick(arg.event,'playlistType'));
        ElementButtonWrap.appendChild(AddPlaylistbuttonElement);

        if (arg.view.type !== 'dayGridMonth') {
        const TimeElement = document.createElement('div');
        TimeElement.classList.add('start_end_time');
        // TimeElement.textContent = `(${arg.event.start != null ? arg.event.start.toLocaleString().split(', ')[1] : ''} ${arg.event.end != null ? 'to ' + arg.event.end.toLocaleString().split(', ')[1] : ''})`;

        const formatTime = (time) => time.toLocaleString().split(', ')[1].slice(0, -3);

TimeElement.textContent = `(${arg.event.start != null ? formatTime(arg.event.start) : ''} ${arg.event.end != null ? 'to ' + formatTime(arg.event.end) : ''})`;

        wrapTextElement.appendChild(TimeElement);
    }
        eventElement.appendChild(wrapTextElement);

        return { domNodes: [eventElement] };
    }

    handleCustomButtonClick(event: any): void {
        console.log("delte event");
        const calendarApi = this.calendarComponent.getApi();
        const eventObj = calendarApi.getEventById(event.id);
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                if (eventObj) {
                    eventObj.remove();
                    this.sharedService.setScheduleDateToSave('', '');
                }
                Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your event is safe :)', 'info');
            }
        });
    }
    selectedPlaylist: string;
    AddPlaylistClick(event: any, playlistType: string): void {
        console.log('AddPlaylistClick')
        this.selectedPlaylist = playlistType;
        this.selectEvent_id = event._def.publicId;
        const popupContainer = document.querySelector('.new_schedule_body');
        if (popupContainer) {
            popupContainer.classList.add('increased_width');
        }

        const dialogRef = this.dialog.open(PopupComponent, {
            data: {
                title: 'Playlist',
                showSearchbar: true,
                action: "Add Playlist",
                value: '',
                type: '9'
            },
            direction: 'ltr',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (popupContainer) {
                popupContainer.classList.remove('increased_width');
            }
        });

        setTimeout(() => {
            this.sharedService.setTriggerOfPopupSearchPlaceHolderText("Search for playlists")
            this.sharedService.setModuleSearchType('playlist')
        }, 500);
    }

    handleDateSelect(selectInfo: any): void {
        const calendarApi = selectInfo.view.calendar;
        const startDate = selectInfo.startStr;
        const endDate = selectInfo.endStr;

        const newEvent: EventInput = {
            title: this.selected_playlist_name,
            start: startDate,
            end: endDate
        };
        calendarApi.addEvent(newEvent);
        calendarApi.unselect();

        this.sharedService.setScheduleDateToSave(startDate, endDate)
    }

    onDateSelectionChange(event: any): void {
        this.calendarOptions.initialDate = this.dateFormat(this.selectedDate, 'yyyy-MM-dd');
        this.calendarComponent.getApi().gotoDate(this.calendarOptions.initialDate);
        this.calendarComponent.getApi().render();
    }

    onEditSchedule() {
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

    onUpdateScheduleName() {
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

    onScreenDelete(index: number) {
        this.SelectedScreens.splice(index, 1);

        let selected_screen_ids = this.helperService.getObjectFromLocatStorage('selected_screens');
        selected_screen_ids.splice(index, 1);

        this.helperService.saveObjectInLocatStorage('selected_screens', selected_screen_ids);
        this.sharedService.setScheduleScreensToSave(selected_screen_ids)
    }

    onAddScreens() {
        console.log("onAddScreens")
        this.sharedService.setModuleSearchType('screens');
        this.helperService.loadSelectScreenPopup(this.SelectedScreens)
    }

    clickSaveSchedule() {
        console.log("clickSaveSchedule")
        let schedule_data = this.sharedService.getScheduleRecordToSave()

        this.apiScheduleService.postScheduleCreate(schedule_data).subscribe((response: any) => {
            console.log("response: ", response)
            if (response) {
                this.helperService.showToasterNotifications('success', 'Schedule saved suceesfully')
                this.router.navigate(["/admin/dashboard/schedules"]);
            }
        })
    }

    @HostListener('window:resize', ['$event'])
    @HostListener('window:load', ['$event'])
    onResize(event: any) {
        this.isMobileScreenSize = window.innerWidth <= 1500;
        if (this.isMobileScreenSize) {
            this.el.nativeElement.querySelector('.calendar-card').classList.add('hide');
        } else {
            this.el.nativeElement.querySelector('.calendar-card').classList.remove('hide');
        }
    }

    toggleLayoutSidebar() {
        this.isCollapsed = !this.isCollapsed;
    }
}
