import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-side-component',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './user-side-component.component.html',
  styleUrl: './user-side-component.component.css'
})
export class UserSideComponentComponent {

}
