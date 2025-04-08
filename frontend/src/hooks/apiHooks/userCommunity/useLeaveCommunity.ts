import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { leaveCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useLeaveCommunity = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (communityId: string) => leaveCommunity(accessToken, communityId),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
