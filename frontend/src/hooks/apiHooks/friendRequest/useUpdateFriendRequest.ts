import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateFriendRequest } from '../../../api';
import { FriendRequestActionT } from '../../../types';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateFriendRequest = (accessToken: string, action: FriendRequestActionT) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (receiverId: string) => updateFriendRequest(accessToken, receiverId, action),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
