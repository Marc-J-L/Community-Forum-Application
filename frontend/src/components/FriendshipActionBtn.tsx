import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useAuth } from '../contexts';
import { useGetFriendRequests, useGetFriendships } from '../hooks';
import { AddFriendBtn, DeleteFriendBtn } from './common';

interface PropsI {
	userId: string;
}

export function FriendshipActionBtn({ userId }: PropsI) {
	const { accessToken } = useAuth();

	const { data: friends } = useGetFriendships(accessToken as string);
	const isFriend = useMemo(() => friends?.find(f => f.friend.id === userId), [friends, userId]);

	const { data: requestsReceived } = useGetFriendRequests(accessToken as string, 'received');
	const isRequestReceived = useMemo(
		() => requestsReceived?.find(r => r.user.id === userId && r.status === 'Pending'),
		[requestsReceived, userId]
	);

	const { data: requestsSent } = useGetFriendRequests(accessToken as string, 'sent');
	const isRequestSent = useMemo(
		() => requestsSent?.find(r => r.user.id === userId && r.status === 'Pending'),
		[requestsSent, userId]
	);

	if (isRequestReceived || isRequestSent) {
		return (
			<Button disabled variant='contained' onClick={e => e.stopPropagation()}>
				Request Pending
			</Button>
		);
	} else if (isFriend) {
		return <DeleteFriendBtn friendId={userId} />;
	} else {
		return <AddFriendBtn receiverId={userId} />;
	}
}
