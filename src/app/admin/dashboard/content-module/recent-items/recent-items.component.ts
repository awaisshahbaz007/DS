import { Component, Input, HostListener } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { HelperService } from "src/app/core/service/helper.service";

@Component({
	selector: 'app-recent-items',
	templateUrl: './recent-items.component.html',
	styleUrls: ['./recent-items.component.sass']
})

export class RecentItemsComponent {
	@Input() dataArray: any[];
	isMobileScreenSize: boolean;

	constructor(
		public dialog: MatDialog,
		private apiContentService: ApiContentService,
		private helperService: HelperService,
	) {
		this.isMobileScreenSize = window.innerWidth <= 768;
	}

	SelectRecentItem(item) {
		this.apiContentService.getSelectedItemDetailsInPopup(item.id)
	}

	slideConfig = {
		slidesToShow: 2,
		slidesToScroll: 3,
		arrows: false,
		dots: false,
    infinite: true,
    autoplay: false,

	};

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.isMobileScreenSize = window.innerWidth <= 768;
	}

}
