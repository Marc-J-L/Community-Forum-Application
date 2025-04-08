// src/hooks/useDeletePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { deletePostRequest } from "../../../api/apis/post.api";
import { postQueryKeys } from "../../../consts";

export const useDeletePost = (postId :string) => {
  const errorHandler = useGenericErrHandler();
  const queryClient = useQueryClient();
  
  return useMutation<string, AxiosError, string>({
    mutationFn: (postId: string) => deletePostRequest(postId),
    onError: (err) => {
      console.error(err);
      errorHandler(err);
    },
    onSuccess: () => {
      // Invalidate the relevant queries to refresh the UI
      queryClient.invalidateQueries(
        {
          queryKey: postQueryKeys.deleting(postId),
        }
      );
    },
  });
};

