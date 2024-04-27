import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import User from '../../models/User.interface';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, tap } from 'rxjs';
import { selectError, selectIsLoading, selectUser } from '../../states/User/user.selectors';
import * as UserActions from '../../states/User/user.actions';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @Output() openEditProfileForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  noProfileImg: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVJm69EJHsFuzuY5rGHvLv0jcO6MACgPyNGrSKe4Fm1yH0SB-Dcpf79OVa4vGi2yIYUrI&usqp=CAU';
  user: User = {
    name: '',
    email: '',
    profileImg: ''
  };
  user$ = this.store.pipe(select(selectUser));
  isLoading$ = this.store.pipe(select(selectIsLoading));
  error$ = this.store.pipe(select(selectError));
  constructor(private route: Router, private store: Store<any>) { 
    this.store.dispatch(UserActions.getUserData());
    this.user$.subscribe((res) => {
      if(res){
        this.user = res as User;
      }
    });
    this.error$.subscribe((res) => {
      if(res){
        console.error(res);
      }
    })
  }

  onClick(): void{
    this.openEditProfileForm.emit(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }
}
