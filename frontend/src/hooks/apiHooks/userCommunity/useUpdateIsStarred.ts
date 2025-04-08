import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateIsStarred } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateIsStarred = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: ({ communityId, isStarred }: { communityId: string; isStarred: boolean }) =>
			updateIsStarred(accessToken, communityId, isStarred),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
