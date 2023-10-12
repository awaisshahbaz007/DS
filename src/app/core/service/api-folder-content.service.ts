import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MatDialog } from "@angular/material/dialog";


@Injectable({
	providedIn: 'root'
})
export class ApiFolderContentService {
	private CMS_API_URL = environment.CMS_API_URL;

	constructor(
		private http: HttpClient,
		private loadingBarService: LoadingBarService,
		public dialog: MatDialog,
	) {
	}

	getFolderContentList(folder_id: number, data: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/fcc/folder/${folder_id}/content/pagination?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

  	addContentToFolder(folder_id: number, content_ids: any): Observable<any> {
		const options = {
			body: content_ids
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/fcc/folder/${folder_id}/content`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	removeContentFromFolder(folder_id: number, content_ids: any): Observable<any> {
		const options = {
			body: content_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/fcc/folder/${folder_id}/content`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}
}
