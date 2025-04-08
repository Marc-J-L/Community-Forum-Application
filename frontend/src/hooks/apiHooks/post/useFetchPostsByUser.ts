import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchPostsByUser } from '../../../api/apis/post.api';
import { postQueryKeys } from '../../../consts';
import { useAuth } from '../../../contexts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useFetchPostsByUser = (userId?: string) => {
	const { user } = useAuth();
	const id = userId || (user?.id as string);

	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: postQueryKeys.user(id),
		queryFn: () =>
			fetchPostsByUser(id, user?.id)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
	});
};
