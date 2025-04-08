// ../types/comment.type.ts
export interface Comment {
  commentId: string;
  postId: string;
  UserId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}
