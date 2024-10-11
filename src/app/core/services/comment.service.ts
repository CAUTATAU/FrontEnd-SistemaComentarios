import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDTO } from '../models/commentDTO.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para adicionar um comentário
  addComment(comment: CommentDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, comment);
  }

  // Método para obter comentários
  getComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments`);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`)
  }
}
