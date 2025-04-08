import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createFriendRequest } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useCreateFriendRequest = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (receiverId: string) => createFriendRequest(accessToken, receiverId),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
