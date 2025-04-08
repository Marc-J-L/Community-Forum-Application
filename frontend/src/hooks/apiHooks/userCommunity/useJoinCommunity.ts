import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { joinCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useJoinCommunity = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (communityId: string) => joinCommunity(accessToken, communityId),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
