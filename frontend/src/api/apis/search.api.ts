import { GetCommunitiesResDTO, UserInfoDTO } from '../../types';
import { Post } from '../../types/post.type';
import { SEARCH_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const searchCommunities = async (query: string) => {
	const url = `${SEARCH_ENDPOINT}/communities?q=${query}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as GetCommunitiesResDTO;
};

export const searchUsers = async (query: string) => {
	const url = `${SEARCH_ENDPOINT}/users?q=${query}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as UserInfoDTO[];
};

export const searchPosts = async (query: string, page: number = 1, limit: number = 5, userId?: string) => {
	let url = `${SEARCH_ENDPOINT}/posts?q=${query}&page=${page}&limit=${limit}`;

	if (userId) {
		url += `&userId=${userId}`;
	}

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as Post[];
};
