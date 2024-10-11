import { Component, OnInit } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { CommentDTO } from '../../../core/models/commentDTO.model';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService, User } from '../../../core/services/auth.Service';
import { EditCommentDTO } from 'src/app/core/models/editCommentDTO.model';

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
  loggedUser: User | any;

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
        replyText: '',
        editing: false, 
        newContent: ''
      }));
    });
  }

  addComment() {
    if (!this.loggedUser) {
      console.error('Usuário não está logado');
      return; 
    }

    const commentPayload: CommentDTO = {
      userId: this.loggedUser.id, 
      conteudo: this.newComment,
      commentVisibility: this.selectedVisibility,
      allowReplies: this.allowReplies,
      answerOf: 0
    };

    this.commentService.addComment(commentPayload).subscribe(
      (response) => {
        const newComment: Comment = {
          id: response.id,
          author: this.loggedUser.Name, 
          date: new Date(response.createdAt),
          visibility: response.commentVisibility,
          text: response.conteudo,
          allowReplies: response.allowReplies,
          replies: [],
          showReplyInput: false,
          replyText: '',
          answerOf: 0,
          editing: false, 
          newContent: ''
        };
        this.comments.push(newComment);
        this.newComment = '';
      },
      (error) => {
        console.error('Erro ao adicionar comentário', error);
      }
    );
  }

  deleteComment(commentId: number){
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId)
      },
      (error) => {
        console.error('Erro ao deletar comentario', error)
      }
    )
  }

  editComment(comment: Comment) {
    if (!this.loggedUser) {
      console.error('Usuário não está logado');
      return;
    }

    const updatedComment: EditCommentDTO = {
      conteudo: comment.newContent // Envia o novo conteúdo para a atualização
    };

    this.commentService.editComment(comment.id, updatedComment).subscribe(
      response=> {
        const index = this.comments.findIndex(c=> c.id === comment.id);
        if(index!== -1){
          this.comments[index].text = comment.newContent; 
          this.comments[index].editing = false;
        }
      },
      error => {
        console.error('Erro ao atualizar o comentário', error);
      });
    
  }

  toggleReplyInput(comment: Comment) {
    comment.showReplyInput = !comment.showReplyInput;
  }

  toggleEditMode(comment: Comment) {
    comment.editing = !comment.editing;
    comment.newContent = comment.text; 
  }

  replyToComment(comment: Comment) {
    if (!this.loggedUser) {
      console.error('Usuário não está logado');
      return; 
    }

    if (!comment.replyText) {
      console.error('Texto da resposta não pode estar vazio');
      return; 
    }

    const replyPayload: CommentDTO = {
      userId: this.loggedUser.id, 
      conteudo: comment.replyText,
      commentVisibility: comment.visibility,
      allowReplies: false,
      answerOf: comment.id
    };

    this.commentService.addComment(replyPayload).subscribe(
      (response) => {
        const reply: Comment = {
          id: response.id,
          author: this.loggedUser.Name, 
          date: new Date(response.createdAt),
          visibility: response.commentVisibility,
          text: response.conteudo,
          allowReplies: false,
          replies: [],
          showReplyInput: false,
          replyText: '',
          answerOf: 0,
          editing: false, 
          newContent: ''
        };
        comment.replies.push(reply);
        comment.replyText = ''; 
      },
      (error) => {
        console.error('Erro ao responder comentário', error);
      }
    );
  }
}
