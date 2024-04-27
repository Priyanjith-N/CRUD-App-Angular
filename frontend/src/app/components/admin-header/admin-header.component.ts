import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @Input() title!: string;
  @Output() search: EventEmitter<string> = new EventEmitter<string>;

  constructor(private router: Router){}

  onChange(event: any){
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value.trim());
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }
}
