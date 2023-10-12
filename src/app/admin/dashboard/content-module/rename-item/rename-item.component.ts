import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: 'app-rename-item',
	templateUrl: './rename-item.component.html',
	styleUrls: ['./rename-item.component.scss']
})

export class RenameItemComponent {
	currentData: any;
	textInput: string;
	maxCharacters = 25;
	isInvalid = true;
  
	@Output() folderRenameEvent = new EventEmitter<any>();

	folder_name: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		console.log("RenameItemComponent data: ", data)
		this.currentData = data.response_data
		this.folder_name = this.currentData.name.toString().includes(' | ') ? this.currentData.name.split(' | ')[0] : this.currentData.name;
		this.textInput = this.folder_name;
	}

	ngOnInit() {
	}

	onkeyUp(folder_name: string): void {
		this.folderRenameEvent.emit(folder_name);
	}

	getRemainingCharacters(): number {
		let maxCharacters = this.maxCharacters - (this.textInput ? this.textInput.length : 0);
		this.isInvalid = maxCharacters > 0 ? false : true
		return maxCharacters;
	}
}
