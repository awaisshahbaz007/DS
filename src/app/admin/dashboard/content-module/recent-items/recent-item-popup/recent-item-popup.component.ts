import { Component, EventEmitter, Output, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { HelperService } from "src/app/core/service/helper.service";
import * as $ from 'jquery';
import 'select2';

@Component({
    selector: 'app-recent-item-popup',
    templateUrl: './recent-item-popup.component.html',
    styleUrls: ['./recent-item-popup.component.sass']
})

export class RecentItemPopupComponent implements OnInit {
	@Output() PlayListSelectEvent = new EventEmitter<any>();
	@Output() PlayListZoneSelectEvent = new EventEmitter<any>();


    currentContentItemData: any;
    content_item_title: string;
    content_item_thumbnail: string;
    content_item_permaLink: string;
    content_item_type: string;
    item_video_type: string;
    content_duration: any;
    videoformat = ['mp4', 'avi', 'mov', 'wmv'];

    playlistField = false;
    playlist: any = [];
    SelectedZone: any = [];
    zonelist: any = [];
    playlist_id: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiPlaylistService: ApiPlaylistService,
        private helperService: HelperService,
    ) {
        console.log("RecentItemPopupComponent data: ", data)
        this.currentContentItemData = data.response_data
        if (data.show_playlist_section) {
            this.onAddPlaylist();
        }

        this.helperService.removeObjectFromLocatStorage('content_playlist_object')
    }

    ngOnInit() {
        this.content_item_title = this.currentContentItemData.name
        this.content_item_thumbnail = this.currentContentItemData.thumbLink ?? './assets/images/video_thumbnail.png';
        this.content_item_permaLink = this.currentContentItemData.permaLink
        if (this.currentContentItemData.contentType == "IMAGE") {
            this.content_duration = 5
        } else if (this.currentContentItemData.contentType == "VIDEO") {
            this.content_duration = 10
        }

        if (this.videoformat.includes(this.currentContentItemData.format)) {
            this.content_item_type = "video";
            this.item_video_type = this.currentContentItemData.format
        } else {
            this.content_item_type = "image";
        }

        $('.button_wrap > div:last-child').hide();
        $('.cdk-overlay-pane').addClass('menu_open');
    }

    getPlaylistList() {
        $('#playlistSelect').select2({
            placeholder: "Select Playlists",
        });
        this.apiPlaylistService.getPlaylistListWithoutPagination().subscribe((response: any) => {
            this.playlist = response
        })
    }

    getPlaylistZoneList(playlist_id) {
        this.apiPlaylistService.getPlaylistDetails(playlist_id).subscribe((response: any) => {
            console.log("playlistdetails: ", response)
            this.zonelist = response.zones
            this.helperService.saveObjectInLocatStorage('content_playlist_object', response)
        })
    }



    onAddPlaylist() {
        this.playlistField = true;
        const popupContainer = document.querySelector('.cdk-overlay-pane');
        if (popupContainer) {
            popupContainer.classList.add('increased_width');
            $('.cdk-overlay-pane').removeClass('menu_open');
        }

        this.getPlaylistList()

        setTimeout(function () {
            $('.playlist_form').show();
            $('.button_wrap > div:last-child').show();
        }, 400);

        setTimeout(() => {
            $('#zoneSelect').select2({
                placeholder: "Select zone lists",
            }).on('select2:select', function(e) {
                $('#zoneSelect').trigger('click');
            }).on('select2:unselect', function(e) {
                $('#zoneSelect').trigger('click');
            });

        }, 400);
        
    }

    onZonelistChange(event: Event): void{
        const selectedOptions = Array.from((event.target as HTMLSelectElement).selectedOptions);
        const selectedZoneIds = selectedOptions.map(option => option.value);
        this.SelectedZone = selectedZoneIds;
        this.PlayListZoneSelectEvent.emit(this.SelectedZone);
    }

    onPlaylistChange(event: Event): void {
        const playlist_id = (event.target as HTMLSelectElement).value;
        console.log('Selected playlist_id:', playlist_id);
        this.playlist_id = playlist_id
        this.getPlaylistZoneList(playlist_id)
		this.PlayListSelectEvent.emit(playlist_id);
    }
}