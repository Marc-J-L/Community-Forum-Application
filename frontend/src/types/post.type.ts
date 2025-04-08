export interface Post {
  postId: string;
  authorId?: string;
  communityId: string;
  title: string;
  text: string;
  images?: string[];
  authorName: string;
  authorImg: string;
  createdAt: Date;
  updatedAt?: Date;
  commentCount: number;
  visibility:  "public" | "private" | "only-me";  // "public", "private", or "friends"
  likes: string[];
  dislikes: string[];
}

export interface PostCount {
  date: string;  // Assuming the date is a string in 'YYYY-MM-DD' format
  count: number; // The count of posts for that date
}

