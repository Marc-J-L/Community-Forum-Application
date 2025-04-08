import React from 'react';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';

import { Stack, Typography } from '@mui/material';
import { useBlockContext } from '../../contexts/useBlockContext';
import { useFetchPrivatePosts } from '../../hooks/apiHooks/post/useFetchPrivateposts';
import { Post } from '../../types/post.type';

export const Home: React.FC = () => {
	const { user } = useAuth();

	const { blockedUserIds } = useBlockContext();
	const res = useFetchPrivatePosts(user?.id!);
	return (
		<Stack gap={2} className='post-list'>
			{!res || res.data?.data.length == 0 ? (
				<Typography variant='body1' textAlign='center' color='text.secondary' my={3}>
					No posts yet. Be the first to create a post!
				</Typography>
			) : (
				res.data?.data.map((post: Post) => {
					if (blockedUserIds.includes(post.authorId as string)) {
						return null;
					}
					return <PostItem key={post.postId} post={post} user={user} />;
				})
			)}
		</Stack>
	);
};
