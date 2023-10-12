import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})

export class ApiScheduleService {

    private CMS_API_URL = environment.CMS_API_URL;

    constructor(
        private http: HttpClient,
        private loadingBarService: LoadingBarService,
        public dialog: MatDialog,
    ) {
    }

    getScheduleList(data: any): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/scc/schedule?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}&fromDate=${data.from_date ?? ''}&toDate=${data.to_date ?? ''}&selectedScreenId=${data.selected_screen_id ?? ''}&selectedPlaylistId=${data.selected_playlist_id ?? ''}`)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    postScheduleCreate(schedular_details: any): Observable<any> {
		const options = {
			body: schedular_details
		};
		this.loadingBarService.start();
		return this.http.request('POST', `${this.CMS_API_URL}/scc/schedule`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	putScheduleUpdate(schedular_details: any): Observable<any> {
		const options = {
			body: schedular_details
		};
		this.loadingBarService.start();
		return this.http.request('PUT', `${this.CMS_API_URL}/scc/schedule`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getScheduleDetails(schedular_id: any): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/scc/schedule/` + schedular_id)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	getScheduleSearch(search_value: string, size: number = 5): Observable<any> {
		this.loadingBarService.start();
		return this.http.request('GET', `${this.CMS_API_URL}/scc/schedule/search?q=${search_value}&&size=${size}`)
			.pipe(tap(() => this.loadingBarService.complete()));
	}

	deleteSchedule(schedular_ids: any): Observable<any> {
		const options = {
			body: schedular_ids
		};
		this.loadingBarService.start();
		return this.http.request('DELETE', `${this.CMS_API_URL}/scc/schedule/`, options)
			.pipe(tap(() => this.loadingBarService.complete()));
	}
}
