import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCommunity } from '../../../api';
import { CommunityUpdateDTO } from '../../../types';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateCommunity = (accessToken: string, communityId: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (data: CommunityUpdateDTO) => updateCommunity(accessToken, communityId, data),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
