import { useQuery } from '@tanstack/react-query';
import { fetchPostsByDate } from '../../../api/apis/post.api';
import { Post } from '../../../types/post.type';

// Correct usage of `useQuery`
export const useFetchPostsByDate = (selectedDate: string) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts', selectedDate], // Correct use of queryKey
    queryFn: () => fetchPostsByDate(selectedDate), // Correct query function
  });
};
