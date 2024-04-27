import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { catchError, tap } from 'rxjs';
import User from '../../models/User.interface';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    RouterLink,
    AdminHeaderComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  users!: User[];
  private usersData!: User[];
  noProfileImg: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVJm69EJHsFuzuY5rGHvLv0jcO6MACgPyNGrSKe4Fm1yH0SB-Dcpf79OVa4vGi2yIYUrI&usqp=CAU';
  userDeleteId: string = '';
  constructor(private adminService: AdminService){
    this.loadAllUsers();
  }

  private loadAllUsers(): void {
    this.adminService.getAllUsers().pipe(
      tap((res) => {
        if(res.userData){
          this.usersData = res.userData as User[];
          this.users = this.usersData;
        }
      }),
      catchError((err: any) => {
        console.error(err);
        return [];
      })
    ).subscribe();
  }

  filterUserData(event: string): void{
    this.users = this.usersData.filter((each: User) => {
      if(each.name.toLowerCase().includes(event.toLowerCase()) || each.email.toLowerCase().includes(event.toLowerCase())){
        return true
      }else{
        return false;
      }
    })
  }

  deleteUser(userId: string): void {
    this.userDeleteId = userId;
  }

  closeModal(){
    this.userDeleteId = '';
  }

  confirmDelete(event: any) {
    event.stopPropagation();
    this.adminService.deleteUser(this.userDeleteId).pipe(
      tap((res) => {
        if(res.message){
          this.loadAllUsers();
          this.userDeleteId = '';
        }
      }),
      catchError((err: any) => {
        console.error(err);
        return [];
      })
    ).subscribe();
  }
}
