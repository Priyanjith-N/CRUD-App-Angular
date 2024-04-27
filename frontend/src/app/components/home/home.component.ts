import { Component } from '@angular/core';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { EditProfileFOrmComponent } from '../edit-profile-form/edit-profile-form.component';
import { UserService } from '../../service/user.service';
import { catchError, tap } from 'rxjs';
import User from '../../models/User.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    UserProfileComponent,
    EditProfileFOrmComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userData!: User;
  editForm: boolean = false;

  constructor(private userSerivice: UserService){
  }

  showForm(status: boolean): void {
    this.editForm = status;
  }
}
