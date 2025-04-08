import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { friendshipQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useDeleteFriendship } from '../../hooks';

interface PropsI {
	friendId: string;
}

export function DeleteFriendBtn({ friendId }: PropsI) {
	const { accessToken } = useAuth();
	const queryClient = useQueryClient();

	const { mutate: deleteFriendship, isPending } = useDeleteFriendship(accessToken as string);

	const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();

		if (confirm('Are you sure to delete this friend?')) {
			deleteFriendship(friendId, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: friendshipQueryKeys.all });
					enqueueSnackbar('Friend deleted', { variant: 'success' });
				},
				onError: () => {
					enqueueSnackbar('Failed to delete friend', { variant: 'error' });
				},
			});
		}
	};

	return (
		<LoadingButton loading={isPending} onClick={handleBtnClick} variant='contained' color='error'>
			Delete Friend
		</LoadingButton>
	);
}
