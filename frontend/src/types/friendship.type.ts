import { UserInfoDTO } from './user.type';

export type FriendshipT = {
	id: string;
	isCloseFriend: boolean;
	createdAt: string;
	friend: UserInfoDTO;
};
