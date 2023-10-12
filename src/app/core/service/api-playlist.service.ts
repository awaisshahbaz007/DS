import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { MatDialog } from "@angular/material/dialog";



@Injectable({
	providedIn: 'root'
})

export class ApiPlaylistService {

	private CMS_API_URL = environment.CMS_API_URL;

	constructor(
		private http: HttpClient,
		private loadingBarService: LoadingBarService,
		public dialog: MatDialog,
	) {
	}

	getPlaylistList(data: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pc/playlist?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getPlaylistListWithoutPagination(search_value: string = ""): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pc/playlist?page=1&size=5&sortBy=updatedDate&sortOrder=asc`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

  getPlaylistListWithoutPaginationSearch(search_value: string = ""): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pc/playlists?q=${search_value}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getPlaylistZones(playlist_id): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pac/playlist/${playlist_id}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	postPlaylistCreate(playlist_details: any): Observable<any> {
		const options = {
			body: playlist_details
		};
		this.loadingBarService.start();
		return this.http.request('POST', `${this.CMS_API_URL}/pc/playlist`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	putPlaylistUpdate(playlist_details: any): Observable<any> {
		const options = {
			body: playlist_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/pc/playlist`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getPlaylistDetails(playlist_id: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pc/playlist/` + playlist_id)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getPlaylistSearch(search_value: string, size: number = 5): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/pc/playlist/search?q=${search_value}&&size=${size}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	deletePlaylist(playlist_ids: any): Observable<any> {
		const options = {
			body: playlist_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/pc/playlist/`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}
}
