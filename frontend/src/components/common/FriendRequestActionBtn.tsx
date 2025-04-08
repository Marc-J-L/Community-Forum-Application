import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { friendRequestQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useUpdateFriendRequest } from '../../hooks/apiHooks/friendRequest/useUpdateFriendRequest';
import { FriendRequestActionT, FriendRequestTypeT } from '../../types';

interface PropsI {
	requestId: string;
	action: FriendRequestActionT;
}

export function FriendRequestActionBtn({ requestId, action }: PropsI) {
	const { accessToken } = useAuth();
	const queryClient = useQueryClient();
	const { mutate: updateFriendRequest, isPending } = useUpdateFriendRequest(accessToken as string, action);

	const options = useMemo((): { type: FriendRequestTypeT; color: 'success' | 'error' | 'info'; message: string } => {
		switch (action) {
			case 'accept':
				return { type: 'received', color: 'success', message: 'Accepted this friend request' };
			case 'reject':
				return { type: 'received', color: 'error', message: 'Rejected this friend request' };
			default:
				return { type: 'sent', color: 'info', message: 'Canceled this friend request' };
		}
	}, [action]);

	const handleBtnClick = () =>
		updateFriendRequest(requestId, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: friendRequestQueryKeys.type(options.type) });
				enqueueSnackbar(options.message, { variant: 'success' });
			},
		});

	return (
		<LoadingButton loading={isPending} onClick={handleBtnClick} variant='contained' color={options.color}>
			{action}
		</LoadingButton>
	);
}
