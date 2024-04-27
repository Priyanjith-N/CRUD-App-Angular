import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-side',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './admin-side.component.html',
  styleUrl: './admin-side.component.css'
})
export class AdminSideComponent {
  constructor(route: Router){
    
  }
}
