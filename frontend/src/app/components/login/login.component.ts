import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Observable, catchError, map, pipe, tap } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectError, selectIsLoading, selectUser } from '../../states/User/user.selectors';
import { UserLogin } from '../../states/Models/User.interface';
import * as UserActions from '../../states/User/user.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);
  user$ = this.store.select(selectUser);
  isFormSubmited: boolean = false;
  constructor(private userService: UserService, private route: Router, private store: Store<any>) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(): void {
    if(!this.loginForm.valid || this.isFormSubmited){
      return this.loginForm.markAllAsTouched();
    }

    this.isFormSubmited = true;

    const userData: UserLogin = this.loginForm.value;
    
    this.store.dispatch(UserActions.login({formData: userData}));

    this.user$.subscribe((res) => {
      if (res) {
        this.isFormSubmited = false;
      }
    });

    this.error$.subscribe((res) => {
      if (res?.error) {
        this.isFormSubmited = false;
        const errFieldObj: { [key: string]: boolean } = {};
        const fieldName = res.error.errOpt as string; 
        errFieldObj[fieldName] = true;
        this.loginForm.get(res.error.err)?.setErrors(errFieldObj);
      }
    });
  }
}
