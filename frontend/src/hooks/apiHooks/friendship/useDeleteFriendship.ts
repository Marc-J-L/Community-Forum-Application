import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteFriendship } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useDeleteFriendship = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (friendId: string) => deleteFriendship(accessToken, friendId),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
