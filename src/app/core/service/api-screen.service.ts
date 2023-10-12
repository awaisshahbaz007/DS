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

export class ApiScreenService {

    private CMS_API_URL = environment.CMS_API_URL;

    constructor(
        private http: HttpClient,
        private loadingBarService: LoadingBarService,
        public dialog: MatDialog,
    ) {
    }

    getScreenList(data: any): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/sc/screen?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    getSearchScreenList(search_text: string): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/sc/screen?page=1&size=5&sortBy=updatedDate&sortOrder=asc`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    getSearchPopupScreenList(search_text: string): Observable<any> {
        this.loadingBarService.start();
         return this.http.request('GET', `${this.CMS_API_URL}/sc/screens?q=${search_text}`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    getScreenDetails(screen_id: any): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/sc/screen/${screen_id}`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    getSelectedScreenList(screen_ids: []): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/sc/screen/list?screenIds=${screen_ids}`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    putPairScreen(pair_details: any): Observable<any> {
		const options = {
			body: pair_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/sc/screen/code/pair`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

    putScreenSave(screen_details: any): Observable<any> {
		const options = {
			body: screen_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/sc/screen`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

    deleteScreen(screen_ids: any): Observable<any> {
		const options = {
			body: screen_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/sc/screen/`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}
}
