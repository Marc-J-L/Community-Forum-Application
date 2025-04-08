// // hooks/apiHooks/comment/useEditComment.ts
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { editComment } from '../../../api/apis/comment.api'; // The API function for editing comments
// import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
// import { AxiosError } from 'axios';

// interface EditCommentParams {
//   commentId: string;
//   content: string;
//   postId: string; // Add postId to invalidate the correct query
// }

// export const useEditComment = () => {
//   const errorHandler = useGenericErrHandler();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ commentId, content }: EditCommentParams) => editComment(commentId, content), // Calls the API function to edit the comment
//     onSuccess: (_, { postId }) => {
//       queryClient.invalidateQueries({ queryKey: ['comments', postId] }); // Invalidate the comments query for the specific post
//     },
//     onError: (err: AxiosError) => {
//       console.error('Error editing comment:', err);
//       errorHandler(err); // Handle errors using your error handler
//     },
//   });
// };



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

interface EditCommentParams {
  commentId: string;
  content: string;
  postId: string; // To invalidate the query correctly
}

export const useEditComment = () => {
  const queryClient = useQueryClient();

  const editCommentInFirestore = async ({ commentId, content }: EditCommentParams) => {
    const firestore = getFirestore();
    const commentDocRef = doc(firestore, 'comments', commentId);
    await updateDoc(commentDocRef, {
      Content: content,
      UpdatedAt: new Date(),
    });
  };

  return useMutation({
    mutationFn: editCommentInFirestore,
    onSuccess: (_, { postId }) => {
      // Invalidate the specific post's comments query
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error) => {
      console.error('Error editing comment:', error);
    },
  });
};
