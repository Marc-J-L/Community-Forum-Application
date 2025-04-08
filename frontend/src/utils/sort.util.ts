import { FriendshipT, UserCommunityT } from '../types';

export const sortUserCommunities = (a: UserCommunityT, b: UserCommunityT) => {
	if (a.isStarred === b.isStarred) {
		return a.name.localeCompare(b.name);
	}
	return a.isStarred ? -1 : 1;
};

export const sortFriendships = (a: FriendshipT, b: FriendshipT) => {
	if (a.isCloseFriend === b.isCloseFriend) {
		return a.friend.firstName.localeCompare(b.friend.firstName);
	}
	return a.isCloseFriend ? -1 : 1;
};
