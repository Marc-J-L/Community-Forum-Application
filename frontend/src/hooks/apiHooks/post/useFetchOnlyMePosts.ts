import { useQuery } from "@tanstack/react-query";
import { fetchOnlyMePosts } from "../../../api/apis/post.api";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { AxiosError } from "axios";

export const useFetchOnlyMePosts = (userId: string) => {
    const errorHandler = useGenericErrHandler();
    return useQuery({
        queryKey: ['posts', userId],
        queryFn:() => fetchOnlyMePosts(userId)
        .then(res => res)
        .catch((err: AxiosError) => {
            console.error(err);
            errorHandler(err);
            return null;
        }),
    }
  );
};