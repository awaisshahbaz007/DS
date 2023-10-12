import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { SharedService } from "src/app/core/service/shared.service";
import { ApiLayoutService } from "src/app/core/service/api-layout.service";
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

@Component({
    selector: 'app-new-playlist',
    templateUrl: './new-playlist.component.html',
    styleUrls: ['./new-playlist.component.scss']
})

export class NewPlaylistComponent {
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;
    @ViewChildren('slickItem') slickItems: QueryList<ElementRef>;

    pagination: any = {}
    selected_layout_id: string;
    all_zones: any = [];
    playlist_object = {
        'id': '',
        'name': '',
        'layoutId': '',
        'zones': []
    }
    isStuck: boolean = false;
    playlist_id: any;
    playlist_name: string = "New PlayList";
    playlist_duration: number = 0
    playlist_duration_text: string = "0 Sec";
    isCollapsed: boolean = true;

    selected_zone_id: any;
    selected_layout_name: string;
    selected_zone_name: string;

    transition_type: string = "Fade";
    transition_speed: string = "Medium";

    selected_list_type: string = "IMAGE";
    showComingSoonDiv: boolean = false;
    search_value: string;

    content_data_to_select: any = []
    playlist_content_data_to_create: any = []
    playlist_content_data: any = [
        [], [], [], [], [],
    ]

    slideConfig = {
        slidesToShow: 7,
        "slidesToScroll": 1,
        "arrows": true,
        "dots": false,
        'autoplay': false,
        'infinite': false,
        "speed": 100,
        // "initialSlide": this.playlist_content_data.length - 1,
        "centerMode": false,
        "variableWidth": true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    };

    constructor(
        private el: ElementRef,
        private apiContentService: ApiContentService,
        private apiPlaylistService: ApiPlaylistService,
        private apiLayoutService: ApiLayoutService,
        private helperService: HelperService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private sharedService: SharedService,
    ) {
    }

    ngOnInit() {
        this.selected_layout_id = this.helperService.getUserSelectedLayoutId();
        this.initializePaginationObj();
        this.getContentList();
        this.layoutZones(this.selected_layout_id);
        let dialogRef: any;
        this.sharedService.playlist_preview_screens.subscribe(
          (playlist_preview) => {
                    if(playlist_preview){

                        const popupContainer = document.querySelector('.menu_light');
                        if (popupContainer) {
                            popupContainer.classList.add('increased_width_lg');
                        }
                        dialogRef = this.dialog.open(PopupComponent, {
                          data: {
                                selected_layout: this.selected_layout_name,
                                zonelist: this.all_zones,
                            title: 'Preview Playlist',
                            showSearchbar: false,
                            value: '',
                            type: '16'
                          },
                          direction: 'ltr',
                        });
                        dialogRef.backdropClick().subscribe(() => {
                          this.dialog.closeAll();
                          setTimeout(function(){
                            popupContainer.classList.remove('increased_width_lg');
                          },80);

                        });
                    }
          }
        )

        setTimeout(() => {
            this.route.params.subscribe(params => {
                this.playlist_id = params['id']; // Assuming the route parameter is named 'id'
                if (this.playlist_id) {
                    this.apiPlaylistService.getPlaylistDetails(this.playlist_id).subscribe((response: any) => {
                        this.renderPlayListPreDefinedData(response)
                    })
                } else {
                    let playlist_data_from_localstorage = this.helperService.getObjectFromLocatStorage('playlist_object');
                    this.renderPlayListPreDefinedData(playlist_data_from_localstorage)
                }
            });
        }, 500);

    }

    renderPlayListPreDefinedData(playlist_objet): void {
        if (playlist_objet) {
            this.playlist_name = playlist_objet.name
            this.selected_layout_id = playlist_objet.layoutId

            this.playlist_object.id = this.playlist_id
            this.playlist_object.name = this.playlist_name
            this.playlist_object.layoutId = this.selected_layout_id
            this.playlist_object.zones = playlist_objet.zones
            this.SelectZone(this.all_zones[0].zone_id)

            this.helperService.saveObjectInLocatStorage('playlist_object', this.playlist_object);
            console.log("ON START this.playlist_object: ", this.playlist_object)
        }
    }

    initializePaginationObj() {
        this.pagination = {
            totalPage: 0,
            pageNumber: 0,
            pageSize: 8,
            totalItems: 0,

            pageSizeOptions: [8, 12, 16, 20],
            sortBy: 'updatedDate',
            sortOrder: 'DESC',
            contentType: 'ALL',
            keyword: '',
        }
    }

    getContentList(content_type: string = "IMAGE", keyword: string = '') {
        this.pagination.contentType = content_type
        this.pagination.keyword = keyword

        this.apiContentService.getContentList(this.pagination).subscribe((response: any) => {
            if (response) {
                let all_content_items = response.content
                all_content_items.forEach((item: any) => {
                    item.duration = content_type == "IMAGE" ? 5 : 10
                })
                this.content_data_to_select = all_content_items;
            }

            this.settingDataTableProperties(response)
        })
    }

    layoutZones(layout_id) {
        this.apiLayoutService.getLayoutWithDetails(layout_id).subscribe((response: any) => {
            this.selected_layout_name = this.helperService.ReplaceTextSpacesWithUnderScore(response.name)
            let layout_zones = response.zones
            layout_zones.forEach((zone: any) => {
                let current_zone = {
                    'zone_id': zone.id,
                    'zone_name': zone.name,
                }
                this.all_zones.push(current_zone);
            })
            this.SelectZone(this.all_zones[0].zone_id)
            this.setPlayListDefaultObject();
        })
    }

    setPlayListDefaultObject() {
        let all_zones_data = [];
        this.all_zones.forEach((zone: any) => {
            let current_zone = {
                'playlistId': '0',
                'zoneId': zone.zone_id,
                'transitionType': 'Fade',
                'transitionSpeed': 'Medium',
                'duration': 0,
                'contents': [],
                'contentsWithDetails': []
            }
            all_zones_data.push(current_zone);
        })
        this.playlist_object.id = this.playlist_id
        this.playlist_object.name = this.playlist_name
        this.playlist_object.layoutId = this.selected_layout_id
        this.playlist_object.zones = all_zones_data
    }

    updatePlayListObject(duration_time_for_content_details = undefined, box_id = undefined) {
        console.log("before updatePlayListObject duration_time_for_content_details: ", duration_time_for_content_details)

        this.playlist_object.name = this.playlist_name
        this.playlist_object.layoutId = this.selected_layout_id

        const selected_zone_index = this.playlist_object.zones.findIndex(zone => zone.zoneId === this.selected_zone_id);
        if (selected_zone_index !== -1) {
            this.playlist_object.zones[selected_zone_index].transitionType = this.transition_type;
            this.playlist_object.zones[selected_zone_index].transitionSpeed = this.transition_speed;
            this.playlist_object.zones[selected_zone_index].duration = this.playlist_duration;
            this.playlist_object.zones[selected_zone_index].contents = this.playlist_content_data_to_create;
            this.playlist_object.zones[selected_zone_index].contentsWithDetails = this.playlist_content_data;

            if (box_id !== undefined) {
                console.log("this.playlist_object.zones[selected_zone_index]: ", this.playlist_object.zones[selected_zone_index])
                this.playlist_object.zones[selected_zone_index].contentsWithDetails[box_id][0].duration = duration_time_for_content_details

                // this.playlist_object.zones[selected_zone_index].contentsWithDetails[box_id].forEach((content_with_details: any, index) => {
                //     content_with_details.duration = duration_time_for_content_details
                // });
            }
        }

        this.helperService.saveObjectInLocatStorage('playlist_object', this.playlist_object);
    }

    onClickEditPlaylistName() {
        const element = this.el.nativeElement.querySelector('#edit_playlist_name');
        const getplayListName = this.el.nativeElement.querySelector('.playlistName').innerText;
        console.log("getplayListName: ", getplayListName)
        if (element) {
            element.style.display = 'block';
            element.focus();
            element.value = getplayListName;
            this.el.nativeElement.querySelector('.playlistName').style.display = 'none';
            this.el.nativeElement.querySelector('.edit_playlist_btn').style.display = 'none';
            this.el.nativeElement.querySelector('.update_playlist_name').style.display = 'block';
        }
    }

    onUpdatePlaylistName() {
        const element = this.el.nativeElement.querySelector('#edit_playlist_name');
        if (element.value.length > 0) {
            this.el.nativeElement.querySelector('.edit_playlist_btn').style.display = 'block';
            this.el.nativeElement.querySelector('.update_playlist_name').style.display = 'none';
            element.style.display = "none";
            this.el.nativeElement.querySelector('.playlistName').style.display = 'block';
            this.el.nativeElement.querySelector('.playlistName').innerText = element.value;

            this.playlist_name = element.value;
            this.updatePlayListObject();
        }
    }

    addMorePlayListSlotBox(event: Event) {
        this.playlist_content_data.push([]);
        setTimeout(() => {
            this.slickModal.slickNext();
        }, 0);
    }

    ngAfterViewInit() {
        this.initCarousel();
    }

    initCarousel() {
        // The carousel should automatically initialize with the provided settings.
        // However, if you have any issues with the initialization, you can try using a slight delay.
        setTimeout(() => {
            this.goToLastSlide();
        }, 100);
    }

    private goToLastSlide() {
        // Go to the last slide on initialization or window resize
        if (this.slickItems && this.slickItems.length > 0) {
            const lastIndex = this.playlist_content_data.length - 1;
            this.slickModal.slickGoTo(lastIndex);
        }
    }

    setPlayListDurationText() {
        if (this.playlist_duration > 59) {
            const minutes = Math.floor(this.playlist_duration / 60);
            const remainingSeconds = this.playlist_duration % 60;
            this.playlist_duration_text = `${minutes} minute ${remainingSeconds} sec`;
        } else {
            this.playlist_duration_text = this.playlist_duration + " sec"
        }
    }

    setPlayListDuration(operation: string, duration: number, box_id = undefined) {
        var duration_time_for_content_details = duration
        if ((box_id != undefined) && this.playlist_content_data_to_create[box_id]) {
            if (operation == "+") {
                this.playlist_content_data_to_create[box_id].duration += duration
            } else if (operation == "-") {
                this.playlist_content_data_to_create[box_id].duration -= duration
            }
            duration_time_for_content_details = this.playlist_content_data_to_create[box_id].duration
        }

        let duration_time = 0;
        this.playlist_content_data_to_create.forEach((content: any) => {
            if (content != undefined) {
                duration_time = duration_time + content.duration
            }
        });
        this.playlist_duration = duration_time;

        this.setPlayListDurationText();
        this.updatePlayListObject(duration_time_for_content_details, box_id);
    }

    onDrop(event: CdkDragDrop<string[]>, box_id: string) {
        console.log("box_id: ", box_id, ", onDrop: ", event)
        const empty_slot_box = this.getEmptySlotBoxById(box_id);
        if (empty_slot_box) {
            let current_content_data = event.previousContainer.data[event.previousIndex];
            if (empty_slot_box.length > 0) {
                empty_slot_box.splice(event.currentIndex, 1, current_content_data);
                this.setPlayListContentArray(box_id, current_content_data, 1)
            } else {
                empty_slot_box.push(current_content_data);
                this.setPlayListContentArray(box_id, current_content_data)
            }

            let duration = this.helperService.getDurationForPlaylistContent(current_content_data)
            this.setPlayListDuration("+", duration);
        }
    }

    setPlayListContentArray(box_id, content_data, is_update = 0) {
        let duration = this.helperService.getDurationForPlaylistContent(content_data)

        if (is_update == 0) {
            this.playlist_content_data_to_create[box_id] = {
                "id": 0,
                "playlistZoneId": 0,
                "contentId": content_data.id,
                "duration": duration,
                "ordinal": box_id,
            }
        } else {
            this.playlist_content_data_to_create[box_id].contentId = content_data.id
            this.playlist_content_data_to_create[box_id].duration = duration
        }
    }

    getEmptySlotBoxById(boxId: string): string[] | undefined {
        return this.playlist_content_data[boxId] ?? [];
    }

    incrementTime(event: Event, box_id: number) {
        const clickedElement = event.currentTarget as HTMLElement;
        const INPUTvalueElement = clickedElement.parentElement.children[1] as HTMLInputElement;
        let value = INPUTvalueElement.value;
        var updatedValue = (parseInt(value) + 1).toString();
        INPUTvalueElement.value = updatedValue;

        this.setPlayListDuration("+", 1, box_id);
    }

    decrementTime(event: Event, box_id: number) {
        const clickedElement = event.currentTarget as HTMLElement;
        const INPUTvalueElement = clickedElement.parentElement.children[1] as HTMLInputElement;
        let value = INPUTvalueElement.value;
        if (parseInt(value) > 1) {
            var updatedValue = (parseInt(value) - 1).toString();
            INPUTvalueElement.value = updatedValue;
            this.setPlayListDuration("-", 1, box_id);
        }
    }

    toggleLayoutSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    ResetZoneContents() {
        this.playlist_duration = 0;
        this.playlist_duration_text = '0 Sec';
        this.playlist_content_data_to_create = [];
        this.playlist_content_data = [
            [], [], [], [], [],
        ];
    }

    RenderZonePreviousData(zone_id, get_from_local_storage = 0): void {
        if (get_from_local_storage == 1) {
            this.playlist_object = this.helperService.getObjectFromLocatStorage('playlist_object')
        }

        const selected_zone_index = this.playlist_object.zones.findIndex(zone => zone.zoneId === zone_id);
        if (selected_zone_index !== -1) {
            console.log("selected_zone_index: ", selected_zone_index)
            console.log("this.playlist_object.zones[selected_zone_index]: ", this.playlist_object.zones[selected_zone_index])

            this.transition_type = this.playlist_object.zones[selected_zone_index].transitionType;
            this.transition_speed = this.playlist_object.zones[selected_zone_index].transitionSpeed;
            this.playlist_duration = this.playlist_object.zones[selected_zone_index].duration;
            this.playlist_content_data = this.playlist_object.zones[selected_zone_index].contentsWithDetails
            this.playlist_content_data_to_create = this.playlist_object.zones[selected_zone_index].contents;

            this.setPlayListDurationText()

            console.log("RenderZonePreviousData this.playlist_content_data: ", this.playlist_content_data)
            if (this.playlist_content_data.length == 0) {
                this.playlist_content_data = [
                    [], [], [], [], [],
                ];
            }
        }
    }

    SelectZone(zone_id, get_from_local_storage = 0) {
        const selected_zone = this.all_zones.find(zone => zone.zone_id === zone_id);
        if (selected_zone) {
            this.selected_zone_id = selected_zone.zone_id
            this.selected_zone_name = selected_zone.zone_name

            this.ResetZoneContents();
            this.RenderZonePreviousData(selected_zone.zone_id, get_from_local_storage);
        }
    }

    SelectTransitionType(transition_type) {
        console.log("transition_type: ", transition_type)
        this.transition_type = transition_type
        this.updatePlayListObject();
    }

    SelectTransitionSpeed(transition_speed) {
        console.log("transition_speed: ", transition_speed)
        this.transition_speed = transition_speed
        this.updatePlayListObject();
    }

    DeleteContent(event: Event, box_index) {
        event.preventDefault();

        delete this.playlist_content_data_to_create[box_index];
        this.playlist_content_data.splice(box_index, 1);
        this.playlist_content_data.splice(box_index, 0, []);

        const selected_zone_index = this.playlist_object.zones.findIndex(zone => zone.zoneId === this.selected_zone_id);
        this.playlist_object.zones[selected_zone_index].contents = this.playlist_content_data_to_create;
        this.playlist_object.zones[selected_zone_index].contentsWithDetails = this.playlist_content_data;
        this.helperService.saveObjectInLocatStorage('playlist_object', this.playlist_object);

        this.SelectZone(this.selected_zone_id, 1);
    }

    SelectListType(list_type) {
        this.selected_list_type = list_type
        if (list_type == "IMAGE" || list_type == "VIDEO") {
            this.initializePaginationObj();
            this.getContentList(list_type);
            this.showComingSoonDiv = false;
        } else {
            this.showComingSoonDiv = true;
            this.pagination = {}
        }
        this.search_value = '';
    }

    applySearchFilter(event: Event) {
        const search_value = (event.target as HTMLInputElement).value;
        this.getContentList(this.selected_list_type, search_value)
    }

    settingDataTableProperties(api_response: any, reset_properties = 0) {
        // setting datatable operation related stuff
        if (reset_properties == 1) {
            this.initializePaginationObj();
        }
        this.pagination.totalPage = api_response.totalPages
        this.pagination.pageNumber = api_response.number
        this.pagination.pageSize = api_response.size
        this.pagination.totalItems = api_response.totalElements
    }

    pageChangeEvent(event: any) {
        if (this.pagination.pageSize != event.pageSize) {
            this.pagination.pageNumber = 0
        } else {
            this.pagination.pageNumber = event.pageIndex
        }
        this.pagination.pageSize = event.pageSize
        this.pagination.totalItems = event.length

        this.getContentList(this.selected_list_type)
    }

    @HostListener('window:scroll', ['$event'])
    onScroll() {
        if (window.innerWidth < 768) {
            const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            this.isStuck = offset >= 158; // Adjust the value as needed to determine when the div should stick
        }

    }
}
