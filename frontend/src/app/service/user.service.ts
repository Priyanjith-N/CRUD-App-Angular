import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../models/User.interface';
import { UpdateUserData } from '../states/Models/User.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {  }

   loginUser(userData: {email: string, password: string}): Observable<any> {
    const url: string = `${this.api}/user`;
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
   }

   registerUser(userData: User): Observable<any> {
    const url: string = `${this.api}/createUser`;
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
   }

   verifyToken(): Observable<any> {
    const url: string = `${this.api}/verifyToken`;
    return this.http.get(
      url,
      this.httpOptions()
    );
   }

   getUserDetails(): Observable<any> {
    const url: string = `${this.api}/getUser`;
    return this.http.get(
      url,
      this.httpOptions()
    );
   }

   updateUser(newUserData: UpdateUserData): Observable<any> {
    const url: string = `${this.api}/updateUser`;
    return this.http.put(
      url,
      newUserData,
      this.httpOptions()
    );
   }

   httpOptions() {
    const token: string = localStorage.getItem('token') ?? "";

    return {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': token
       })
    };
   }
}
