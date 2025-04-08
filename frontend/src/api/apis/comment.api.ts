// src/api/apis/comment.api.ts
import { sendRequest } from './request';
import { Comment } from '../../types/comment.type';
import { COMMENT_ENDPOINT } from '../endpoints';
import { getAuth } from 'firebase/auth';

// Fetch comments for a specific post
export const getPostComments = async (postId: string) => {
  const url = `${COMMENT_ENDPOINT}/by-post?postId=${postId}`;
  const res = await sendRequest({ method: 'GET', endpoint: url });
  return res.data as Comment[];
};

// Create a new comment
export const createComment = async (commentData: Comment) => {
  // Get the user's token from Firebase Auth
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error('User is not authenticated');

  // Ensure the token is passed with the request
  const url = `${COMMENT_ENDPOINT}`;
  await sendRequest({
    method: 'POST',
    endpoint: url,
    body: commentData,
    accessToken: token,  // Pass the token to the API
  });
};

// Delete a comment
export const deleteComment = async (commentId: string) => {
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error('User is not authenticated');

  const url = `${COMMENT_ENDPOINT}/${commentId}`;
  await sendRequest({
    method: 'DELETE',
    endpoint: url,
    accessToken: token,
  });
};


// Edit an existing comment
export const editComment = async (commentId: string, content: string) => {
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error('User is not authenticated');

  const url = `${COMMENT_ENDPOINT}/${commentId}`;
  
  await sendRequest({
    method: 'PUT',
    endpoint: url,
    body: { content },  // Pass the updated content of the comment
    accessToken: token,  // Ensure the token is passed with the request
  });
};