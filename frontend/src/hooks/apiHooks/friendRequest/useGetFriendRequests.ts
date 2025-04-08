import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getFriendRequests } from '../../../api';
import { friendRequestQueryKeys } from '../../../consts';
import { FriendRequestTypeT } from '../../../types';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetFriendRequests = (accessToken: string, type: FriendRequestTypeT) => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: friendRequestQueryKeys.type(type),
		queryFn: () =>
			getFriendRequests(accessToken, type)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
