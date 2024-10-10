// src/app/features/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  name: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.name).subscribe({
      next: (user) => this.router.navigate(['/comments']),
      error: (err) => this.errorMessage = 'Login falhou!'
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
