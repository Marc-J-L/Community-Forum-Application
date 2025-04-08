
import { UserInfoDTO } from '../../types/user.type';
import { USER_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getUserInfo = async (userId: string) => {
	const url = `${USER_ENDPOINT}/${userId}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as UserInfoDTO;
};

