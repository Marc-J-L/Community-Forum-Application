import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../../../api/apis/post.api";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { AxiosError } from "axios";
import { postQueryKeys } from "../../../consts";

// Hook for adding/removing a like
export const useLikePost = (postId: string) => {
    const queryClient = useQueryClient();
    const errorHandler = useGenericErrHandler();
  
    const likePostMutation = useMutation({
      mutationFn: (userId: string) => likePost(postId, userId),
      onError: (err: AxiosError) => {
        console.error(err);
        errorHandler(err);
      },
      onSuccess: () => {
        // Invalidate post query to refresh data
        queryClient.invalidateQueries({
          queryKey:postQueryKeys.all(),
        } );
      },
    });
  
    const unlikePostMutation = useMutation({
      mutationFn: (userId: string) => unlikePost(postId, userId),
      onError: (err: AxiosError) => {
        console.error(err);
        errorHandler(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:postQueryKeys.all(),
        });       
      },
    });
  
    return { likePostMutation, unlikePostMutation };
  };


