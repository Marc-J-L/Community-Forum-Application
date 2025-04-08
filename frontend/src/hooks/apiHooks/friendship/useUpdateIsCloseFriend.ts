import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateIsCloseFriend } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateIsCloseFriend = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: ({ friendId, isCloseFriend }: { friendId: string; isCloseFriend: boolean }) =>
			updateIsCloseFriend(accessToken, friendId, isCloseFriend),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
