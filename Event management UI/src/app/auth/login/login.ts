import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both your email address and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    let role = 'USER';
    if (this.email.toLowerCase().includes('admin')) {
      role = 'ADMIN';
    } else if (this.email.toLowerCase().includes('manager')) {
      role = 'MANAGER';
    }

    const session = {
      email: this.email,
      role: role
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(session));

    setTimeout(() => {
      this.loading = false;
      if (role === 'USER') {
        this.router.navigate(['/user-panel/dashboard']);
      } else if (role === 'MANAGER') {
        this.router.navigate(['/manager-dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 400);
  }
}
