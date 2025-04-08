import { UserInfoDTO } from './user.type';

export type FriendRequestT = {
	id: string;
	createdAt: string;
	status: 'Pending' | 'Accepted' | 'Rejected' | 'Canceled';
	user: UserInfoDTO;
};

export type FriendRequestTypeT = 'sent' | 'received';
export type FriendRequestActionT = 'accept' | 'reject' | 'cancel';
