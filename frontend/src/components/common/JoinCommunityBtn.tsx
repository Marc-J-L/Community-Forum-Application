import { AddCircle } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { userCommunityQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useJoinCommunity } from '../../hooks';
import { CommunityT, UserCommunityT } from '../../types';
import { sortUserCommunities } from '../../utils';

interface PropsI {
	community: CommunityT;
	isJoined: boolean;
}

export function JoinCommunityBtn({ community, isJoined }: PropsI) {
	const { id: communityId, name: communityName } = community;

	const queryClient = useQueryClient();

	const { accessToken } = useAuth();
	const { mutate: joinCommunity, isPending } = useJoinCommunity(accessToken as string);

	const addUserCommunity = (newCommunity: UserCommunityT) => {
		queryClient.setQueryData<UserCommunityT[]>(userCommunityQueryKeys.all, oldCommunities => {
			if (!oldCommunities) return [newCommunity];
			const updatedCommunities = [...oldCommunities, newCommunity];
			return updatedCommunities.sort(sortUserCommunities);
		});
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();

		joinCommunity(communityId, {
			onSuccess: res => {
				queryClient.invalidateQueries();
				addUserCommunity(res);
				enqueueSnackbar(`Joined "${communityName}"`, { variant: 'success' });
			},
			onError: error => {
				console.log(error);
				enqueueSnackbar('An error occurred', { variant: 'error' });
			},
		});
	};

	return (
		<Chip
			icon={isJoined ? undefined : <AddCircle />}
			label={isJoined ? 'Joined' : isPending ? 'Joining...' : 'Join'}
			disabled={isPending || isJoined}
			onClick={handleClick}
			color='primary'
		/>
	);
}
