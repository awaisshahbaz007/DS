import { Component, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DataTableServiceService } from 'src/app/core/service/data-table-service.service';
import { ApiContentService } from "src/app/core/service/api-content.service";
import { ApiPlaylistService } from 'src/app/core/service/api-playlist.service';
import { ApiScheduleService } from 'src/app/core/service/api-schedule.service';
import { ApiScreenService } from 'src/app/core/service/api-screen.service';
import { Router } from "@angular/router";
import { HelperService } from "src/app/core/service/helper.service";
import { SharedService } from "src/app/core/service/shared.service";

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})

export class SearchComponent {
	search_list: any = [];
	recent_search_box;
	search_value: string;
	no_result_li: boolean = false;
	search_placeholder_text: any;

	constructor(
		private dataTableService: DataTableServiceService,
		private apiContentService: ApiContentService,
		private apiPlaylistService: ApiPlaylistService,
		private apiScheduleService: ApiScheduleService,
		private apiScreenService: ApiScreenService,
		private el: ElementRef,
		private router: Router,
		private helperService: HelperService,
		private sharedService: SharedService,
	) {
		this.sharedService.search_placeholder_text.subscribe(
			(placeholder_text) => {
				console.log("search_placeholder_text: ", placeholder_text)
				this.search_placeholder_text = placeholder_text
			}
		);
	}

	applyFilter(event: Event) {
		const search_value = (event.target as HTMLInputElement).value;
		console.log("applyFilter search_value: ", search_value)
		if (search_value == "") {
			this.no_result_li = false;
			this.search_list = [];
		} else {
			let module_name = this.sharedService.getModuleType()
			if (module_name == "content") {
				this.apiContentService.getContentSearch(search_value).subscribe((response: any) => {
					console.log("response: ", response)
					this.search_list = response
					if (response.length < 1) {
						this.no_result_li = true;
					}
				})
			} else if (module_name == 'playlist') {
				this.apiPlaylistService.getPlaylistListWithoutPaginationSearch(search_value).subscribe((response: any) => {
					console.log("getPlaylistListWithoutPagination response: ", response)
					this.search_list = response
					if (response.length < 1) {
						this.no_result_li = true;
					}
				})
			} else if (module_name == 'schedule') {
				this.apiScheduleService.getScheduleSearch(search_value).subscribe((response: any) => {
					console.log("getScheduleSearch response: ", response)
					this.search_list = response
					if (response.length < 1) {
						this.no_result_li = true;
					}
				})
			} else if (module_name == 'screens') {
				this.apiScreenService.getSearchPopupScreenList(search_value).subscribe((response: any) => {
					this.search_list = response
					if (response.length < 1) {
						this.no_result_li = true;
					}
				})
			}
		}
	}

	onFocus(event: Event) {
		this.recent_search_box = this.el.nativeElement.querySelector('.search_box .recent_search');
		if (this.recent_search_box) {
			this.recent_search_box.style.display = 'block';
		}
	}

	onFocusOut(event: Event): void {
		setTimeout(() => {
			console.log('Delayed execution after 2 seconds.');
			const recentSearch = this.el.nativeElement.querySelector('.search_box .recent_search');
			if (recentSearch) {
				recentSearch.style.display = 'none';

			}

			this.search_value = '';
			this.search_list = [];
		}, 500);
	}

	SelectSearchItem(selected_element) {
		let module_name = this.sharedService.getModuleType();
		if (module_name == "content") {
			if (selected_element.type == 'FOLDER') {
				this.router.navigate(["/admin/dashboard/content-module/folder/" + selected_element.id]);
			}
			else {
				this.apiContentService.getSelectedItemDetailsInPopup(selected_element.id)
			}
		} else if (module_name == "playlist") {
			this.router.navigate(["/admin/dashboard/playlist/edit/" + selected_element.id]);
		} else if (module_name == "screens") {
			this.router.navigate(["/admin/dashboard/screens/screen_orientation/" + selected_element.id]);
		}
	}
}

