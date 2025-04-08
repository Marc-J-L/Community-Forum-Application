import { Post } from './post.type';
export interface PostItemProps {
    post: Post;
    onLike?: () => void;
    onDislike?: () => void;
    onCommentSubmit?: (comment: string) => void;
    isOwner?: boolean;
  }