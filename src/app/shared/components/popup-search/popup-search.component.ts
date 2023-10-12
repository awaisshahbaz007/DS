import { Component, Input, ElementRef, Renderer2, ViewChild,Output, EventEmitter } from '@angular/core';
import { DataTableServiceService } from 'src/app/core/service/data-table-service.service';
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiPlaylistService } from 'src/app/core/service/api-playlist.service';
import { ApiScheduleService } from 'src/app/core/service/api-schedule.service';
import { ApiScreenService } from 'src/app/core/service/api-screen.service';
import { Router } from "@angular/router";
import { HelperService } from "src/app/core/service/helper.service";
import { SharedService } from "src/app/core/service/shared.service";

@Component({
    selector: 'app-popup-search',
    templateUrl: './popup-search.component.html',
    styleUrls: ['./popup-search.component.scss'],

})

export class PopupSearchComponent {
  @Output() radioButtonSelected = new EventEmitter<boolean>();
   searchScreenResults: any[] = [];
   searchPlaylistResults: any[] = [];
   selectedPlaylist: any;
	 dataScreentableColumns: any = [
		{ name: 'Name', field: 'name' },
		{ name: 'Location', field: 'location' }
	];
  isSearchResultsVisible: boolean = false;
  isSearchplaylistResults: boolean = false;
    recent_search_box;
    popup_search_value: string;
    no_result_li: boolean = false;
    popup_search_placeholder_text: any;

    constructor(
        private apiPlaylistService: ApiPlaylistService,
        private apiScreenService: ApiScreenService,
        private el: ElementRef,
        private helperService: HelperService,
        private sharedService: SharedService,

    ) {
        this.sharedService.popup_search_placeholder_text.subscribe(
            (placeholder_text) => {
                console.log("popup_search_placeholder_text: ", placeholder_text)
                this.popup_search_placeholder_text = placeholder_text
            }
        );
    }

    applyFilter(event: Event) {
        const popup_search_value = (event.target as HTMLInputElement).value;
        let module_search_name = this.sharedService.getModuleSearchType()

        if (module_search_name == 'screens') {
           this.isSearchResultsVisible = true;
           this.isSearchResultsVisible = popup_search_value.length > 0;
            let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')
            this.apiScreenService.getSearchPopupScreenList(popup_search_value).subscribe((response: any) => {
            let all_screens_response = response;
            all_screens_response.forEach((screen: any) => {
              let is_checked = false
              if (selected_screens) {
                is_checked = selected_screens.includes(screen.id) ?? true
              }
              screen.isChecked = is_checked;
              screen.name = screen.name ?? '---';
              screen.location = screen.location ?? '---'
            })
            console.log('all_screens_response', all_screens_response);
            this.searchScreenResults = all_screens_response;
          });
        } else if (module_search_name == "playlist") {
           this.isSearchplaylistResults = true;
            this.apiPlaylistService.getPlaylistListWithoutPaginationSearch(popup_search_value).subscribe((response: any) => {
                console.log("getSearchScreenList popup response: ", response)
                if (response.length) {
                    this.searchPlaylistResults = response.map((playlist: any) => {
                      playlist.updatedDate = playlist.updatedDate ? this.helperService.formatDate(playlist.updatedDate) : '---';
                      return playlist;
                    });
                }
            })

        }
    }

    selectPlaylist(playlist: any) {
        this.selectedPlaylist = playlist;
        // this.radioButtonSelected = true;
        this.radioButtonSelected.emit(true);
        console.log("this.selectedPlaylist: ", this.selectedPlaylist)
        this.sharedService.setSchedulePlayListObject(this.selectedPlaylist);
        console.log('radioButtonSelected:', this.radioButtonSelected);

      }

  //   onInputBlur() {
  //     console.log("blur work")
  //     this.isSearchResultsVisible = false;
  // }
  onBodyClick(event: Event) {
      const target = event.target as HTMLElement;
      const searchDiv = document.querySelector('.searchscreenlis');
      const searchInput = document.querySelector('.mat-input-element'); // Adjust the selector based on your input structure

      if (!searchDiv.contains(target) && !searchInput.contains(target)) {
          // Click occurred outside the search input and the search results div, hide the div
          this.isSearchResultsVisible = false;
          this.isSearchplaylistResults = false;
      }

  }
  ngOnInit() {

      document.body.addEventListener('click', this.onBodyClick.bind(this));
  }
  ngOnDestroy() {
    // Remove the event listener when the component is destroyed
     document.body.removeEventListener('click', this.onBodyClick.bind(this));
}
    onFocus(event: Event) {
        this.recent_search_box = this.el.nativeElement.querySelector('.search_box .recent_search');
        if (this.recent_search_box) {
            this.recent_search_box.style.display = 'block';
        }
    }
}
