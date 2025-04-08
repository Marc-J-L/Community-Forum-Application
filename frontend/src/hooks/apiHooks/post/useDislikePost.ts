import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dislikePost, undislikePost } from "../../../api/apis/post.api";
import { AxiosError } from "axios";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { postQueryKeys } from "../../../consts";

export const useDislikePost = (postId: string) => {
    const queryClient = useQueryClient();
    const errorHandler = useGenericErrHandler();
  
    const dislikePostMutation = useMutation({
      mutationFn: (userId: string) => dislikePost(postId, userId),
      onError: (err: AxiosError) => {
        console.error(err);
        errorHandler(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey:postQueryKeys.all(),
          }
        );
      },
    });
  
    const undislikePostMutation = useMutation({
      mutationFn: (userId: string) => undislikePost(postId, userId),
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
  
    return { dislikePostMutation, undislikePostMutation };
  };