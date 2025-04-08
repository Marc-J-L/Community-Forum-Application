import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Checkbox, Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { friendshipQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useUpdateIsCloseFriend } from '../../hooks';
import { FriendshipT } from '../../types';
import { sortFriendships } from '../../utils';

interface PropsI {
	friendship: FriendshipT;
}

export function CloseFriendBtn({ friendship }: PropsI) {
	const queryClient = useQueryClient();

	const { accessToken } = useAuth();
	const { mutate: updateIsCloseFriend } = useUpdateIsCloseFriend(accessToken as string);

	const updateFriendship = (checked: boolean) => {
		queryClient.setQueryData<FriendshipT[]>(friendshipQueryKeys.all, oldFriendships => {
			if (!oldFriendships) return [friendship];
			const updatedCommunities = oldFriendships.map(f =>
				f.id === friendship.id ? { ...friendship, isCloseFriend: checked } : f
			);
			return updatedCommunities.sort(sortFriendships);
		});
	};

	return (
		<Tooltip title={friendship.isCloseFriend ? 'Remove from close friends' : 'Add to close friends'}>
			<Checkbox
				color='error'
				icon={<FavoriteBorder />}
				checkedIcon={<Favorite />}
				checked={friendship.isCloseFriend}
				onClick={e => e.stopPropagation()}
				onChange={(_e, checked) =>
					updateIsCloseFriend(
						{
							friendId: friendship.friend.id,
							isCloseFriend: checked,
						},
						{
							onSuccess: () => {
								queryClient.invalidateQueries({ queryKey: friendshipQueryKeys.all });
								updateFriendship(checked);
								enqueueSnackbar(`${checked ? 'Added' : 'Removed'} close friend"`, {
									variant: 'success',
								});
							},
						}
					)
				}
			/>
		</Tooltip>
	);
}
