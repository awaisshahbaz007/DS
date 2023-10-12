import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MatDialog } from "@angular/material/dialog";


@Injectable({
	providedIn: 'root'
})

export class ApiFolderService {
	private CMS_API_URL = environment.CMS_API_URL;

	constructor(
		private http: HttpClient,
		private loadingBarService: LoadingBarService,
		public dialog: MatDialog,
	) {
	}

	getFolderList(data?: any): Observable<any> {
		let url = `${this.CMS_API_URL}/dc/folder`;
		if (data !== undefined) {
			url += `?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}`
		} else {
			url += `?paging=false`
		}
		this.loadingBarService.start();
		return this.http.request('GET', url)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getFolderDetails(folder_id: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/dc/folder/` + folder_id)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	deleteFolder(folder_ids: any): Observable<any> {
		const options = {
			body: folder_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/dc/folder`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	postFolderCreate(folder_details: any): Observable<any> {
		const options = {
			body: folder_details
		};
		this.loadingBarService.start();
		return this.http.request('POST', `${this.CMS_API_URL}/dc/folder`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	postFolderUpdate(folder_details: any): Observable<any> {
		const options = {
			body: folder_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/dc/folder`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}
}
