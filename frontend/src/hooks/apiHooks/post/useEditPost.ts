
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPostRequest } from "../../../api/apis/post.api";
import { Post } from "../../../types/post.type";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { AxiosError } from "axios";
import { postQueryKeys } from "../../../consts";


export const useEditPost = (postId: string) => {
  const errorHandler = useGenericErrHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Post) => editPostRequest(postData),
    onError: (err: AxiosError) => {
      console.error(err);
      errorHandler(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.editing(postId),
      });
    },
  });
};