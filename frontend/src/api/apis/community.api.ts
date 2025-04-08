import { CommunityCreateDTO, CommunityT, CommunityUpdateDTO } from '../../types';
import { COMMUNITY_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getCommunityById = async (communityId: string) => {
	const url = `${COMMUNITY_ENDPOINT}/${communityId}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as CommunityT;
};

export const createCommunity = async (accessToken: string, data: CommunityCreateDTO) => {
	const res = await sendRequest({
		method: 'POST',
		endpoint: COMMUNITY_ENDPOINT,
		accessToken,
		body: data,
	});

	return res;
};

export const updateCommunity = async (accessToken: string, communityId: string, data: CommunityUpdateDTO) => {
	const url = `${COMMUNITY_ENDPOINT}/${communityId}`;

	const res = await sendRequest({
		method: 'PATCH',
		endpoint: url,
		accessToken,
		body: data,
	});

	return res;
};
