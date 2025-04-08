import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../config';

export const usePendingFriendRequests = (userId: string) => {
	if (!userId) return 0;

	const [pendingCount, setPendingCount] = useState<number>(0);

	useEffect(() => {
		const friendRequestsRef = collection(db, 'friend_requests');

		const pendingRequestsQuery = query(
			friendRequestsRef,
			where('ReceiverId', '==', userId),
			where('Status', '==', 'Pending')
		);

		const unsubscribe = onSnapshot(pendingRequestsQuery, snapshot => {
			setPendingCount(snapshot.size);
		});

		return () => unsubscribe();
	}, [userId]);

	return pendingCount;
};
