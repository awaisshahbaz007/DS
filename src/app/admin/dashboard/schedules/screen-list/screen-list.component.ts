import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiScreenService } from 'src/app/core/service/api-screen.service';
import { SharedService } from 'src/app/core/service/shared.service';

@Component({
	selector: 'app-screen-list',
	templateUrl: './screen-list.component.html',
	styleUrls: ['./screen-list.component.scss']
})

export class ScreenListComponent {
  @Output() checkoutButtonSelected = new EventEmitter<boolean>();
  @Output() onCheckoutSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
	search_screen_text: string = '';
	datatableColumns: any = [
		{ name: 'Name', field: 'name' },
		{ name: 'Location', field: 'location' }
	];

	datatableRecord: any = [];

	constructor(
		private apiScreenService: ApiScreenService,
		private helperService: HelperService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
	) {
		console.log('ScreenListComponent')
	}

	ngOnInit() {
		this.getScreenList()
		this.sharedService.update_popup_screen_list.subscribe(
			(search_screens) => {
				let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')
				console.log("search_screens: ", search_screens)
				search_screens.forEach((screen: any) => {
					let is_checked = false
					if (selected_screens) {
						is_checked = selected_screens.includes(screen.id) ?? true
					}
					screen.isChecked = is_checked;
					screen.schedule = screen.schedular ?? '---'
					screen.location = screen.location ?? '---'
				})

                this.datatableRecord = search_screens
			}
		)
	}

	getScreenList() {
		let selected_screens = this.helperService.getObjectFromLocatStorage('selected_screens')

		this.apiScreenService.getSearchScreenList(this.search_screen_text).subscribe((response: any) => {
			let all_screens = response.content;

			all_screens.forEach((screen: any) => {
				let is_checked = false
				if (selected_screens) {
					is_checked = selected_screens.includes(screen.id) ?? true
				}
				screen.isChecked = is_checked;
				screen.name = screen.name ?? '---';
				screen.location = screen.location ?? '---'
			})

			this.datatableRecord = all_screens;
		})
	}
   handleRadioButtonSelection(selected: boolean) {
    this.checkoutButtonSelected.emit(selected); // Emit the selected state to the parent component
  }
}
