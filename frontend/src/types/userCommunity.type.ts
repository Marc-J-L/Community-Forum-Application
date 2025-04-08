import { CommunityT } from './community.type';

export type UserCommunityT = CommunityT & {
	isStarred: boolean;
	isCreator: boolean;
};

export type GetUserCommunitiesResDTO = UserCommunityT[];
