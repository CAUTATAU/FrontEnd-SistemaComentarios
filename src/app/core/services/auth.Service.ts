import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO } from '../models/user.model';

export interface User {
  id: number;
  Name: string;
  role: 'ADM' | 'SIGNATARIO';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private loggedUser: User | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    if (name && role) {
      this.loggedUser = { id: 0, Name: name, role: role as 'ADM' | 'SIGNATARIO' }; // ID pode ser ajustado conforme a lógica do seu sistema
    }
  }

  login(Name: string): Observable<any> {
    const loginData = { Name };
    return this.http.post<User>(`${this.apiUrl}/user/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem('userName', response.Name);
        localStorage.setItem('userRole', response.role);
        this.setLoggedUser(response);
      })
    );
  }

  // Método para realizar o registro
  register(user: UserDTO): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/user`, user).pipe(
      tap(response => {
        localStorage.setItem('userName', response.Name);
        localStorage.setItem('userRole', response.role);
        this.setLoggedUser(response);
      })
    );
  }

  setLoggedUser(user: User) {
    this.loggedUser = user;
  }

  getLoggedUser(): Observable<User | undefined> {
    return of(this.loggedUser || undefined);
  }
}
