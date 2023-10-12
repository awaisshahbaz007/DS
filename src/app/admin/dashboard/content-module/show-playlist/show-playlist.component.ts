import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiContentService } from 'src/app/core/service/api-content.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-show-playlist',
  templateUrl: './show-playlist.component.html',
  styleUrls: ['./show-playlist.component.scss']
})
export class ShowPlaylistComponent {
    content_id: any;
    all_playlist: any = [];

    constructor(
		public dialogRef: MatDialogRef<ShowPlaylistComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
		private apiContentService: ApiContentService,
		private router: Router,
	) {
		console.log("ShowPlaylistComponent: ", data)
        this.content_id = data.response_data.id
	}

	ngOnInit() {
		this.getPlayListUsingContent(this.content_id)
	}

    getPlayListUsingContent(content_id) {
		this.apiContentService.getContentItemDetails(content_id).subscribe((response: any) => {
			console.log("response: ", response)
            this.all_playlist = response.playlists
		})
	}

    moveToEditPlayList(playlist_id) {
        this.dialogRef.close(false);
        this.router.navigate(["/admin/dashboard/playlist/edit/" + playlist_id]);
    }
}
