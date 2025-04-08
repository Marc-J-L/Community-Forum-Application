import { FriendshipT } from '../../types';
import { FRIENDSHIP_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getFriendships = async (accessToken: string) => {
	const url = `${FRIENDSHIP_ENDPOINT}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
		accessToken,
	});

	return res.data as FriendshipT[];
};

export const updateIsCloseFriend = async (accessToken: string, friendId: string, isCloseFriend: boolean) => {
	const url = `${FRIENDSHIP_ENDPOINT}/friendId/${friendId}`;

	const res = await sendRequest({
		method: 'PATCH',
		endpoint: url,
		accessToken,
		body: { isCloseFriend },
	});

	return res;
};

export const deleteFriendship = async (accessToken: string, friendId: string) => {
	const url = `${FRIENDSHIP_ENDPOINT}/friendId/${friendId}`;

	const res = await sendRequest({
		method: 'DELETE',
		endpoint: url,
		accessToken,
	});

	return res;
};
