import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.Service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'] 
  })
export class RegisterComponent {
  userName: string = '';
  userRole: 'SIGNATARIO' | 'ADM' = 'SIGNATARIO';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register({ Name: this.userName, role: this.userRole }).subscribe({
      next: () => {
        this.router.navigate(['/comments']); // Navega para a tela de comentários em caso de sucesso
      },
      error: (error) => {
        console.error(error); // Log de erro para verificar detalhes
        this.errorMessage = 'Falha ao registrar. Tente novamente.'; // Mensagem de erro
      }
    });
  }
  
}
