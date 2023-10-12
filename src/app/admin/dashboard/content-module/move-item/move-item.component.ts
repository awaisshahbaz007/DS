import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ApiFolderService } from 'src/app/core/service/api-folder.service';
import { SharedService } from 'src/app/core/service/shared.service';

@Component({
	selector: 'app-move-item',
	templateUrl: './move-item.component.html',
	styleUrls: ['./move-item.component.scss']
})

export class MoveItemComponent {

	selected_Folder_option: string;
	folder_list: any[] = [];
	@Output() folderSelectEvent = new EventEmitter<any>();

	constructor(
		private apiFolderService: ApiFolderService,
		private sharedService: SharedService
	) {

		// Trigger to refresh when folder created within the popup of data copy section
		this.sharedService.folder_created.subscribe(
			(folder) => {
				this.getFolderList();
			}
		);
	}

	ngOnInit() {
		this.getFolderList()
	}

	onFolderOptionSelected(event: any): void {
		console.log('Selected option:', event.value);
		this.folderSelectEvent.emit(event.value);
	}

	getFolderList() {
		this.apiFolderService.getFolderList().subscribe((response: any) => {
			this.folder_list = response
		})
	}
}
