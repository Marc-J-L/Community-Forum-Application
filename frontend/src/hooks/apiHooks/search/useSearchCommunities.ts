import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { searchCommunities } from '../../../api';
import { searchQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useSearchCommunities = (query: string) => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: searchQueryKeys.communities(query),
		queryFn: () =>
			searchCommunities(query)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
