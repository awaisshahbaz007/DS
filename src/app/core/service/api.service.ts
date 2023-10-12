import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private UMS_API_URL = environment.UMS_API_URL;

  storedUser;
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private loadingBarService: LoadingBarService) {
    this.storedUser = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserSubject = new BehaviorSubject<any>(this.storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    // console.log('COMING GGG:::::', this.currentUserSubject.value)
    return this.currentUserSubject.value;
  }

  signUp(user: any): Observable<any> {
    this.loadingBarService.start();
    return this.http.post(`${this.UMS_API_URL}/auth/signup`, user)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  logOut(): Observable<any> {
    this.loadingBarService.start();
    return this.http.request('get', `${this.UMS_API_URL}/auth/signout`)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  signIn(user): Observable<any> {
    this.loadingBarService.start();
    return this.http.post<HttpResponse<any>>(`${this.UMS_API_URL}/auth/signin/local`,
      user, { observe: 'response' }).pipe(
        map((response: any) => {
          response.headers.keys(); // all header names
          response.body // response content
          localStorage.setItem("role", response.body.roles[0].name);
          console.log('response', response)
          console.log('response', response.headers.keys())
          localStorage.setItem("currentUser", JSON.stringify(response.body));
          this.currentUserSubject.next(response.body);
          localStorage.setItem('token', response.body['token'])
          return response.body;
        })
      )
      .pipe(tap(() => this.loadingBarService.complete()));
  }

  signInGoogle(user: any): Observable<any> {
    this.loadingBarService.start();
    const headers = new HttpHeaders({
      'Authorization-Google': user.Authorization.toString()
    });

    return this.http.post(`${this.UMS_API_URL}/auth/signin/google`, null, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: any) => {
        response.headers.keys(); // all header names
        response.body // response content

        console.log('response', response)
        console.log('response', response.headers.keys())
        localStorage.setItem("role", response.body.roles[0].name);
        localStorage.setItem("currentUser", JSON.stringify(response.body));
        this.currentUserSubject.next(response.body);
        localStorage.setItem('token', response.body['token'])
        return response.body;
      })
    )
    .pipe(tap(() => this.loadingBarService.complete()));;
  }

  sendPasswordForMail(data: any): Observable<any> {
    this.loadingBarService.start();
    return this.http.post(`${this.UMS_API_URL}/forget/user/password`, data)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  forgetPassword(data: any): Observable<any> {
    this.loadingBarService.start();
    return this.http.put(`${this.UMS_API_URL}/forget/user/password`, data)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  joinPassword(data: any): Observable<any> {
    this.loadingBarService.start();
    return this.http.put(`${this.UMS_API_URL}/user/join`, data)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  resetPassword(data: any): Observable<any> {
    this.loadingBarService.start();
    return this.http.put(`${this.UMS_API_URL}/forget/user/password`, data)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  user(method: string, data: any): Observable<any> {
    const options = {
      body: data
    };
    console.log('get this.headers', options)
    this.loadingBarService.start();

    return this.http.request(method, `${this.UMS_API_URL}/user`, options)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  users(method: string, data: any): Observable<any> {
    const options = {
      body: data
    };
    console.log('get users this.headers', options)
    this.loadingBarService.start();
    return this.http.request(method, `${this.UMS_API_URL}/users?page=${data.pageNumber ?? 0}&size=${data.pageSize ?? 10}&sortBy=${data.sortBy ?? 'updatedDate'}&sortOrder=${data.sortOrder ?? 'asc'}`, options)
      .pipe(tap(() => this.loadingBarService.complete()));;
  }

  getRoles(): Observable<any> {
    this.loadingBarService.start();
    return this.http.get(`${this.UMS_API_URL}/user/role/list`)
      .pipe(tap(() => this.loadingBarService.complete()));;

  }

  getLocation(): Observable<any> {
    this.loadingBarService.start();
    return this.http.get(`${environment.OMS_API_URL}/organization/` + this.storedUser.organizationId + `/location/` + this.storedUser.locationId)
      .pipe(tap(() => this.loadingBarService.complete()));;

  }

  deletUser(id): Observable<any> {
    this.loadingBarService.start();
    return this.http.delete(`${this.UMS_API_URL}/user/` + id)
      .pipe(tap(() => this.loadingBarService.complete()));;

  }
}
