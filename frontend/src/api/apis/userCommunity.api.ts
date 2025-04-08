import { GetUserCommunitiesResDTO, UserCommunityT } from '../../types';
import { USER_COMMUNITY_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getUserCommunities = async (accessToken: string, option: 'all' | 'owned' | 'joined') => {
	const url = `${USER_COMMUNITY_ENDPOINT}/${option}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
		accessToken,
	});

	return res.data as GetUserCommunitiesResDTO;
};

export const joinCommunity = async (accessToken: string, communityId: string) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'POST',
		endpoint: url,
		accessToken,
	});

	return res.data as UserCommunityT;
};

export const leaveCommunity = async (accessToken: string, communityId: string) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'DELETE',
		endpoint: url,
		accessToken,
	});

	return res;
};

export const updateIsStarred = async (accessToken: string, communityId: string, isStarred: boolean) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'PATCH',
		endpoint: url,
		accessToken,
		body: { isStarred },
	});

	return res;
};
