// // hooks/apiHooks/comment/useCreateComment.ts
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createComment } from '../../../api/apis/comment.api';
// import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
// import { AxiosError } from 'axios';
// import { Comment } from '../../../types/comment.type';

// export const useCreateComment = () => {
//   const errorHandler = useGenericErrHandler();
//   const queryClient = useQueryClient();

//   return useMutation({

//     mutationFn: (commentData: Comment) => createComment(commentData),
//     onError: (err: AxiosError) => {
//       console.error('Error creating comment:', err);
//       errorHandler(err);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ['posts'],
//       });
//     }
   
//   });
// };

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Comment } from '../../../types/comment.type';


export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const createCommentInFirestore = async (commentData: Comment) => {
    const firestore = getFirestore();
    const commentsCollection = collection(firestore, 'comments');
    await addDoc(commentsCollection, {
      PostId: commentData.postId,
      UserId: commentData.UserId,
      Content: commentData.content,
      CreatedAt: commentData.createdAt,
      UpdatedAt: commentData.updatedAt || null,
    });
  };

  return useMutation({
    mutationFn: createCommentInFirestore,
    onSuccess: (_, commentData) => {
      // Invalidate the query for the specific post to fetch updated comments
      queryClient.invalidateQueries({ queryKey: ['comments', commentData.postId] });
    
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
    },
  });
};

