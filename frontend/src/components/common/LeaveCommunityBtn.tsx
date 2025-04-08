import { Cancel } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { userCommunityQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useLeaveCommunity } from '../../hooks';
import { CommunityT, UserCommunityT } from '../../types';

interface PropsI {
	community: CommunityT;
}

export function LeaveCommunityBtn({ community }: PropsI) {
	const { id: communityId, name: communityName } = community;

	const queryClient = useQueryClient();

	const { accessToken } = useAuth();
	const { mutate: leaveCommunity, isPending } = useLeaveCommunity(accessToken as string);

	const removeUserCommunity = (communityId: string) => {
		queryClient.setQueryData<UserCommunityT[]>(userCommunityQueryKeys.all, oldCommunities => {
			if (!oldCommunities) return [];
			return oldCommunities.filter(community => community.id !== communityId);
		});
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();

		leaveCommunity(communityId, {
			onSuccess: () => {
				queryClient.invalidateQueries();
				removeUserCommunity(communityId);
				enqueueSnackbar(`Left "${communityName}"`, { variant: 'success' });
			},
			onError: error => {
				console.log(error);
				enqueueSnackbar('An error occurred', { variant: 'error' });
			},
		});
	};

	return (
		<Chip
			icon={<Cancel />}
			label={isPending ? 'Leaving...' : 'Leave'}
			disabled={isPending}
			onClick={handleClick}
			color='error'
			variant='outlined'
		/>
	);
}
