import { Component, OnInit } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { CommentDTO } from '../../../core/models/commentDTO.model';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService, User } from '../../../core/services/auth.Service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {
  comments: Comment[] = [];
  newComment: string = '';
  allowReplies: boolean = false;
  selectedVisibility: 'TODOS' | 'ADM' | 'SIGNATARIOS' = 'TODOS';
  loggedUser: User | any; // Mantenha como undefined

  constructor(private commentService: CommentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadComments();
    this.authService.getLoggedUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  loadComments() {
    this.commentService.getComments().subscribe((comments) => {
      this.comments = comments.map((comment: any) => ({
        id: comment.id,
        author: comment.user.name,
        date: new Date(comment.createdAt),
        visibility: comment.commentVisibility,
        text: comment.conteudo,
        allowReplies: comment.allowReplies,
        replies: comment.replies || [],
        showReplyInput: false,
        replyText: ''
      }));
    });
  }

  addComment() {
    if (!this.loggedUser) {
      console.error('Usuário não está logado');
      return; // Impede execução se loggedUser for undefined
    }

    const commentPayload: CommentDTO = {
      userId: this.loggedUser.id, // Acessa id
      conteudo: this.newComment,
      commentVisibility: this.selectedVisibility,
      allowReplies: this.allowReplies,
      answerOf: 0
    };

    this.commentService.addComment(commentPayload).subscribe(
      (response) => {
        const newComment: Comment = {
          id: response.id,
          author: this.loggedUser.Name, // Acessa Name
          date: new Date(response.createdAt),
          visibility: response.commentVisibility,
          text: response.conteudo,
          allowReplies: response.allowReplies,
          replies: [],
          showReplyInput: false,
          replyText: '',
          answerOf: 0
        };
        this.comments.push(newComment);
        this.newComment = '';
      },
      (error) => {
        console.error('Erro ao adicionar comentário', error);
      }
    );
  }

  toggleReplyInput(comment: Comment) {
    comment.showReplyInput = !comment.showReplyInput;
  }

  replyToComment(comment: Comment) {
    if (!this.loggedUser) {
      console.error('Usuário não está logado');
      return; // Impede execução se loggedUser for undefined
    }

    if (!comment.replyText) {
      console.error('Texto da resposta não pode estar vazio');
      return; // Impede execução se o texto da resposta estiver vazio
    }

    const replyPayload: CommentDTO = {
      userId: this.loggedUser.id, // Acessa id
      conteudo: comment.replyText,
      commentVisibility: comment.visibility,
      allowReplies: false,
      answerOf: comment.id
    };

    this.commentService.addComment(replyPayload).subscribe(
      (response) => {
        const reply: Comment = {
          id: response.id,
          author: this.loggedUser.Name, // Acessa Name
          date: new Date(response.createdAt),
          visibility: response.commentVisibility,
          text: response.conteudo,
          allowReplies: false,
          replies: [],
          showReplyInput: false,
          replyText: '',
          answerOf: 0
        };
        comment.replies.push(reply);
        comment.replyText = ''; // Limpa o campo de resposta
      },
      (error) => {
        console.error('Erro ao responder comentário', error);
      }
    );
  }
}
