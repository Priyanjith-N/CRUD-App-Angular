import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import User from '../models/User.interface';
import { AdminLogin } from '../states/Models/Admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private api: string = 'http://localhost:8080/admin/api';

  constructor(private http: HttpClient) { }

  verifyToken(): Observable<any> {
    const url: string = `${this.api}/verifyToken`;
    return this.http.get(
      url,
      this.httpOptions()
    );
  }

  login(adminData: AdminLogin): Observable<any> {
    const url: string = `${this.api}/login`;

    return this.http.post(
      url,
      adminData,
      this.httpOptions()
    );
  }

  getAllUsers(): Observable<any> {
    const url: string = `${this.api}/getAllUsers`;

    return this.http.get(
      url,
      this.httpOptions()
    );
  }

  getUserDetails(userId: string): Observable<any> {
    const url: string = `${this.api}/getUserDetails/${userId}`;
    return this.http.get(
      url,
      this.httpOptions()
    );
  }

  updateUser(userId: string, data: User): Observable<any> {
    const url: string = `${this.api}/updateUser/${userId}`;
    return this.http.put(
      url,
      data,
      this.httpOptions()
    )
  }

  deleteUser(userId: string): Observable<any> {
    const url: string = `${this.api}/deleteUser/${userId}`;
    return this.http.delete(
      url,
      this.httpOptions()
    );
  }

  addUser(userData: User): Observable<any> {
    const url: string = `${this.api}/addUser`;
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
  }

  private httpOptions() {
    const token: string = localStorage.getItem('token') ?? "";

    return {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': token
       })
    };
   }
}
