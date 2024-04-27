import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isFormSubmited: boolean = false;

  constructor(private userService: UserService, private route: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if(!this.registerForm.valid || (this.registerForm?.value.password !== this.registerForm?.value.confirmPassword) || this.isFormSubmited) {
      return this.registerForm.markAllAsTouched();
    }

    this.isFormSubmited = true;

    const userData = this.registerForm.value;
    const response$ = this.userService.registerUser(userData);

    response$.pipe(
      tap((res) => {
        this.isFormSubmited = false;
        localStorage.setItem('token', res.token);
        this.route.navigate(['/']);
      }),
      catchError((err: any) => {
        this.isFormSubmited = false;
        this.registerForm.get('email')?.setErrors({ alreadyTaken: true });
        console.error('Error:', err); 
        return [];
      })
    ).subscribe();
  }
}
