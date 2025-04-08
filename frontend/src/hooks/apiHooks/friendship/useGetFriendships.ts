import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getFriendships } from '../../../api';
import { friendshipQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetFriendships = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: friendshipQueryKeys.all,
		queryFn: () =>
			getFriendships(accessToken)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
