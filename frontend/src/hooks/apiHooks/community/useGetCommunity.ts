import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCommunityById } from '../../../api';
import { communityQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetCommunity = (communityId: string) => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: communityQueryKeys.current(communityId),
		queryFn: () =>
			getCommunityById(communityId)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
