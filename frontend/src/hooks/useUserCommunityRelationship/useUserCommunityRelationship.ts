import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { userCommunityQueryKeys } from '../../consts';
import { UserCommunityT } from '../../types';

export const useUserCommunityRelationship = (communityId: string) => {
	const { data: joinedCommunities } = useQuery<UserCommunityT[]>({ queryKey: userCommunityQueryKeys.all });
	const isJoined = useMemo(
		() => joinedCommunities?.find(c => c.id === communityId),
		[communityId, joinedCommunities]
	);
	const isCreator = useMemo(
		() => joinedCommunities?.find(c => c.id === communityId && c.isCreator),
		[communityId, joinedCommunities]
	);

	return { isJoined, isCreator };
};
