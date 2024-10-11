export interface Comment {
  id: number;
  author: string;
  date: Date;
  visibility: 'TODOS' | 'ADM' | 'SIGNATARIOS'; // Pode ser 'TODOS', 'ADM', 'SIGNATARIOS'
  text?: string;
  allowReplies: boolean;
  answerOf: number; // ID do comentário pai (0 se for um comentário principal)
  replies: Comment[];
  showReplyInput: boolean;
  replyText: string;
  editing?: boolean;
  newContent?: string;
}
