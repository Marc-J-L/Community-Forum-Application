import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getUserInfo } from '../../../api';
import { userQueryKeys } from '../../../consts';
import { useAuth } from '../../../contexts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetUserInfo = (userId?: string) => {
	const errorHandler = useGenericErrHandler();
	const { user } = useAuth();

	return useQuery({
		queryKey: userId ? userQueryKeys.user(userId) : userQueryKeys.current,
		queryFn: () =>
			getUserInfo(userId || user?.id || '')
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
