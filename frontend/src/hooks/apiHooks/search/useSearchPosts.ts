import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { searchPosts } from '../../../api';
import { searchQueryKeys } from '../../../consts';
import { useAuth } from '../../../contexts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useSearchPosts = (query: string, page?: number, limit?: number) => {
	const { user } = useAuth();
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: searchQueryKeys.posts(query),
		queryFn: () =>
			searchPosts(query, page, limit, user?.id)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
