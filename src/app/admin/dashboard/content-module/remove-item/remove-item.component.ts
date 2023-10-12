import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-remove-item',
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.scss']
})
export class RemoveItemComponent {
  
  constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		console.log("RemoveItemComponent data: ", data)
	}

}
