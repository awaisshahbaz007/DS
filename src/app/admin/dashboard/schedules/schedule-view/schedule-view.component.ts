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
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    pagination = {
		totalPage: 0,
		pageNumber: 0,
		pageSize: 200,
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

    selectedDate: Date = new Date();
    isMobileScreenSize: boolean;
    isCollapsed: boolean = false;
    eventsData = [];
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        initialDate: this.selectedDate,

        dayHeaderFormat: {
            month: 'short', day: 'numeric'
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        events: [],
        eventContent: this.customizeEventContent.bind(this),
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
        private snackBar: MatSnackBar
    ) {

    }

    ngOnInit() {
		console.log("ngOnInit NewSchedulesComponent: ")
        this.triggerForScheduleList(this.selectedDate)
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
        AddPlaylistbuttonElement.addEventListener('click', () => this.AddPlaylistClick(arg.event));
        ElementButtonWrap.appendChild(AddPlaylistbuttonElement);

        const TimeElement = document.createElement('div');
        TimeElement.classList.add('start_end_time');
        TimeElement.textContent = `(${arg.event.start != null ? '' + arg.event.start.toLocaleString().split(', ')[1] : ''} ${arg.event.end != null ? 'to' + arg.event.end.toLocaleString().split(', ')[1] : ''})`;

        wrapTextElement.appendChild(TimeElement);
        eventElement.appendChild(wrapTextElement);

        return { domNodes: [eventElement] };
    }

    handleCustomButtonClick(event: any): void {

        const calendarApi = this.calendarComponent.getApi();
        const eventObj = calendarApi.getEventById(event.id);
        const snackBarRef = this.snackBar.open('Are you sure you want to delete this event?', 'OK', {
        duration: 5000, // Adjust the duration as needed
      });


        snackBarRef.onAction().subscribe(() => {
            if (eventObj) {
                eventObj.remove();
                this.sharedService.setScheduleDateToSave('', '');
            }
        });
    }

    AddPlaylistClick(event: any): void {
        console.log('AddPlaylistClick')
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

    getStartAndEndDateOfMonth(inputDate: Date): any {
        const date = new Date(inputDate);
        date.setDate(1);

        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);

        // Create the result object
        const start_and_end_date = {
          startDate: this.dateFormat(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd'),
          endDate: this.dateFormat(date, 'yyyy-MM-dd')
        };

        return start_and_end_date;
    }

    onDateSelectionChange(event: any): void {
        let selected_date = this.dateFormat(this.selectedDate, 'yyyy-MM-dd')
        this.calendarOptions.initialDate = selected_date;
        this.calendarComponent.getApi().gotoDate(this.calendarOptions.initialDate);
        this.calendarComponent.getApi().render();

        this.triggerForScheduleList(selected_date)
    }

    triggerForScheduleList(selected_date) {
        const start_and_end_date = this.getStartAndEndDateOfMonth(selected_date);
        console.log("start_and_end_date: ", start_and_end_date)

        let calendar_start_date = start_and_end_date.startDate
        let calendar_end_date = start_and_end_date.endDate
        this.getScheduleList(calendar_start_date, calendar_end_date)
    }

    getScheduleList(start_date, end_date) {
        this.pagination.from_date = start_date
        this.pagination.to_date = end_date

		this.apiScheduleService.getScheduleList(this.pagination).subscribe((response: any) => {
			let all_schedules = response.content
            console.log("all_schedules: ", all_schedules)


			all_schedules.forEach((schedule: any) => {
                let current_schedule = {
                    id: schedule.id,
                    title: schedule.name,
                    start: this.dateFormat(schedule.startDateTime, 'yyyy-MM-dd'),
                }
                this.eventsData.push(current_schedule)
			})

            setTimeout(() => {
                this.calendarOptions.events = this.eventsData
            }, 500);
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
