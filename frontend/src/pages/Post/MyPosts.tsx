import { Stack, Typography } from '@mui/material';
import React from 'react';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useFetchOnlyMePosts } from '../../hooks/apiHooks/post/useFetchOnlyMePosts';

export const MyPosts: React.FC = () => {
	const { user } = useAuth();
	if (user?.id == null) {
		return <div>Error: User ID is required.</div>;
	}
	const userId = user?.id;

	const res = useFetchOnlyMePosts(userId);
	return (
		<Stack gap={2} className='post-list'>
			{!res || res.data?.data.length == 0 ? (
				<Typography variant='body1' textAlign='center' color='text.secondary' my={3}>
					No posts yet.
				</Typography>
			) : (
				res.data?.data.map(post => <PostItem key={post.postId} post={post} user={user} />)
			)}
		</Stack>
	);
};
