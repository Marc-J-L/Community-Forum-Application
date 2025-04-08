import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createCommunity } from '../../../api';
import { CommunityCreateDTO } from '../../../types';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useCreateCommunity = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (data: CommunityCreateDTO) => createCommunity(accessToken, data),
		onError: (err: AxiosError) => {
			console.error(err);
			errorHandler(err);
		},
	});
};
