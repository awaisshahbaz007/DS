import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-folder-popup',
    templateUrl: './folder-popup.component.html',
    styleUrls: ['./folder-popup.component.scss']
})

export class FolderPopupComponent {
    textInput: string;
    maxCharacters = 25;
    isInvalid = true;

    constructor() { }

    @Output() folderNameEvent = new EventEmitter<any>();

    onkeyUp(folder_name: string): void {
        this.folderNameEvent.emit(folder_name);
    }

    getRemainingCharacters(): number {
        let maxCharacters = this.maxCharacters - (this.textInput ? this.textInput.length : 0);
        this.isInvalid = maxCharacters > 0 ? false : true
        return maxCharacters;
    }

}
