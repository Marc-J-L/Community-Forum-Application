import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getUserCommunities } from '../../../api';
import { userCommunityQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetUserCommunities = (accessToken: string, option: 'all' | 'owned' | 'joined' = 'all') => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: option === 'all' ? userCommunityQueryKeys.all : userCommunityQueryKeys[option](),
		queryFn: () =>
			getUserCommunities(accessToken, option)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
