import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})

export class ApiLayoutService {

    private CMS_API_URL = environment.CMS_API_URL;

    constructor(
        private http: HttpClient,
        private loadingBarService: LoadingBarService,
        public dialog: MatDialog,
    ) {
    }

    getAllLayoutsWithZones(): Observable<any> {
        let url = `${this.CMS_API_URL}/lzc/layout?includeZone=true`;
        this.loadingBarService.start();
        return this.http.request('GET', url)
            .pipe(tap(() => this.loadingBarService.complete()));
    }

    getLayoutWithDetails(layout_id: any): Observable<any> {
        this.loadingBarService.start();
        return this.http.request('GET', `${this.CMS_API_URL}/lzc/layout/` + layout_id + '?includeZone=true')
            .pipe(tap(() => this.loadingBarService.complete()));
    }
}
