import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { MatDialog } from "@angular/material/dialog";


@Injectable({
	providedIn: 'root'
})

export class ApiContentService {
	private CMS_API_URL = environment.CMS_API_URL;

	constructor(
		private http: HttpClient,
		private loadingBarService: LoadingBarService,
		public dialog: MatDialog,
	) {
	}

	getContentList(data: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/cc/content?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}&contentType=${data.contentType ?? 'ALL'}&keyword=${data.keyword ?? ''}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	postContentUpload(content_details: any): Observable<any> {
		console.log("content_details: ", content_details)
		const options = {
			body: content_details
		};
		this.loadingBarService.start();
		return this.http.request('POST', `${this.CMS_API_URL}/cc/content/chunk`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	putContentUpdate(content_details: any): Observable<any> {
		const options = {
			body: content_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/cc/content`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getContentItemDetails(content_item_id: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/cc/content/` + content_item_id)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getContentSearch(search_value: string): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/fcc/folder-content/search?q=` + search_value)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getContentRecentItems(): Observable<any> {
		this.loadingBarService.start();
		return this.http.get(`${this.CMS_API_URL}/cc/content/recent/?value=4`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	deleteContentItem(content_item_ids: any): Observable<any> {
		const options = {
			body: content_item_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/cc/content/`, options)
			.pipe(tap(() => this.loadingBarService.complete() ));
	}

	getSelectedItemDetailsInPopup(id, show_playlist_section: boolean = false): any {
		this.getContentItemDetails(id).subscribe((response: any) => {
			console.log('getContentItemDetails', response)

			this.dialog.open(PopupComponent, {
				data: {
					response_data: response,
					title: response.name,
					show_playlist_section: show_playlist_section,
					action: "Add to Playlists",
					value: '',
					type: '4'
				},
				direction: 'ltr',
			});
		})
	}
}
