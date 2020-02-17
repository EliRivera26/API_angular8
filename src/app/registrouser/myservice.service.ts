import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { UserInterface } from '../interface/user-interface';
import { Interceptor } from '../interface/interceptor';

@Injectable({
  providedIn: 'root'

})
export class MyserviceService {

  constructor(private router: Router, private http: HttpClient, private myserviceService: MyserviceService) {
    
  }
  
  list():Observable<Interceptor>{
    const url_api = 'http://localhost:5000/api/';
    return this.http.get<any>(url_api + 'Values/', {headers: this.headers})
    .pipe(map(res => res.json()))
  }
    
    headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  

  generateHeaders() {
    const headers = new Headers();

    if (this.getToken()) {
      headers.append('Authorization', this.getToken());
    }

    return headers;
  }

  registro(username: string, email: string, password: string) {
    const url_api = 'http://localhost:5000/api/';
    return this.http.post<UserInterface>(url_api + 'Login/authenticate', { username, email, password }, { headers: this.headers })
      .pipe(map(data => data));
  }

  login(username: string, email: string, password: string): Observable<any> {

    const url_api = 'http://localhost:5000/api/';

    return this.http.post<UserInterface>(url_api + 'Login/login', { username, email, password }, { headers: this.headers })
      .pipe(map(data => data));
      
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
    this.list()
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem('currentUser');
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  logout() {
    // remove user from local storage to log user out
    let accessToken = localStorage.getItem('accessToken')
    const url_api = 'http://localhost:5000/api/Login/authenticate{accessToken}';
    localStorage.removeItem('accessToken')
    localStorage.removeItem('currentUser')
    return this.http.post<UserInterface>(url_api, { headers: this.headers });
  }

}
