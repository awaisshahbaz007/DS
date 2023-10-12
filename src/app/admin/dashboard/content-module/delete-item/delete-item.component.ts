import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.sass']
})
export class DeleteItemComponent {

  constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		console.log("PopupComponent data: ", data)
	}

  ngOnInit() {
	}
}
