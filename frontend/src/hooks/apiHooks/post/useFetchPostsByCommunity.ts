import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchPostsByCommunity } from '../../../api/apis/post.api';
import { postQueryKeys } from '../../../consts';
import { useAuth } from '../../../contexts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useFetchPostsByCommunity = (communityId: string) => {
	const { user } = useAuth();

	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: postQueryKeys.community(communityId),
		queryFn: () =>
			fetchPostsByCommunity(communityId, user?.id)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
