
import { useMutation } from "@tanstack/react-query";
import { createPostRequest } from "../../../api/apis/post.api";
import { Post } from "../../../types/post.type";
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { AxiosError } from "axios";

export const useCreatePost = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation({
    mutationFn: (postData: Post) => createPostRequest(postData),
    onError: (err: AxiosError) => {
      console.error(err);
      errorHandler(err);
    },
  });
};
