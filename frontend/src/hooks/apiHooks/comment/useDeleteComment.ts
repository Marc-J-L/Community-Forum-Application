// import { useMutation } from '@tanstack/react-query';
// import { deleteComment } from '../../../api/apis/comment.api';
// import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
// import { AxiosError } from 'axios';

// // The hook to delete a comment
// export const useDeleteComment = () => {
//   const errorHandler = useGenericErrHandler();

//   return useMutation({
//     mutationFn: (commentId: string) => deleteComment(commentId),
//     onError: (err: AxiosError) => {
//       console.error(err);
//       errorHandler(err); // Handles the error using your generic error handler
//     },
//   });
// };


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const deleteCommentInFirestore = async (commentId: string) => {
    const firestore = getFirestore();
    const commentDocRef = doc(firestore, 'comments', commentId);
    await deleteDoc(commentDocRef);
  };

  return useMutation({
    mutationFn: deleteCommentInFirestore,
    onSuccess: (_, _commentId) => {
      // Optionally, invalidate all comments or add the specific postId to invalidate
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
    },
  });
};
