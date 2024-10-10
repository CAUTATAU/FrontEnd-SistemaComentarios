// src/app/core/models/comment.model.ts
export interface CommentDTO {
    userId: number;
    conteudo: string;
    commentVisibility: 'TODOS' | 'ADM' | 'SIGNATARIOS'; // Corrigido
    allowReplies: boolean;
    answerOf: number;
}
