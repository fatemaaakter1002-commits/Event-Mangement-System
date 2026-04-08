import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.scss']
})
export class UserLayout implements OnInit {
  userEmail: string = '';

  constructor(private router: Router) {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!session || !session.email || session.role !== 'USER') {
      this.router.navigate(['/login']);
    } else {
      this.userEmail = session.email;
    }
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
