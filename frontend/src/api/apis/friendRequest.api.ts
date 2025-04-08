import { FriendRequestActionT, FriendRequestT, FriendRequestTypeT } from '../../types';
import { FRIEND_REQUEST_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getFriendRequests = async (accessToken: string, type: FriendRequestTypeT) => {
	const url = `${FRIEND_REQUEST_ENDPOINT}/${type}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
		accessToken,
	});

	return res.data as FriendRequestT[];
};

export const createFriendRequest = async (accessToken: string, receiverId: string) => {
	const url = `${FRIEND_REQUEST_ENDPOINT}/receiverId/${receiverId}`;

	const res = await sendRequest({
		method: 'POST',
		endpoint: url,
		accessToken,
	});

	return res;
};

export const updateFriendRequest = async (accessToken: string, requestId: string, action: FriendRequestActionT) => {
	const url = `${FRIEND_REQUEST_ENDPOINT}/${action}/${requestId}`;

	const res = await sendRequest({
		method: 'PUT',
		endpoint: url,
		accessToken,
	});

	return res;
};
