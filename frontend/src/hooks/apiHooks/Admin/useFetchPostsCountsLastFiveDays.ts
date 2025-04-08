import { useQuery } from "@tanstack/react-query";
import { fetchPostCountsLastFiveDays } from "../../../api/apis/post.api";
import { PostCount } from "../../../types/post.type";

// Hook
export const useFetchPostCountsLastFiveDays = () => {
  return useQuery<Record<string, number>, Error, PostCount[]>({
    queryKey: ["postCountsLastFiveDays"],
    queryFn: fetchPostCountsLastFiveDays,
    select: (data: Record<string, number>) => {
      // Transform the dictionary to an array of PostCount
      return Object.entries(data).map(([date, count]) => ({
        date,
        count,
      })) as PostCount[];
    },
  });
};
