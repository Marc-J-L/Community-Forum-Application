import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useBlockContext } from '../../contexts/useBlockContext';
import { useFetchPosts } from '../../hooks/apiHooks';
import { Post } from '../../types/post.type';

export const AllPosts: React.FC = () => {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
	const { user } = useAuth();

	const { blockedUserIds } = useBlockContext();

	return (
		<div>
			<div className='post-list'>
				{!data || !data.pages || data.pages.length === 0 ? (
					<Typography variant='body1' textAlign='center' color='text.secondary' my={3}>
						No posts yet.
					</Typography>
				) : (
					data.pages.map((group, i) => (
						<Stack gap={2} key={i}>
							{Array.isArray(group.data) && group.data.length > 0 ? (
								group.data.map((post: Post) => {
									if (blockedUserIds.includes(post.authorId as string)) {
										return null;
									}

									return <PostItem key={post.postId} post={post} user={user} />; // Pass userId to PostItem
								})
							) : (
								<Typography variant='body1' textAlign='center' color='text.secondary' my={3}>
									No posts yet.
								</Typography>
							)}
						</Stack>
					))
				)}
			</div>

			{/* Load More Posts */}
			{hasNextPage && data && data.pages && data.pages.length > 0 && (
				<div className='actions'>
					<Button
						variant='outlined'
						color='secondary'
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}>
						{isFetchingNextPage ? 'Loading...' : 'Load More'}
					</Button>
				</div>
			)}
		</div>
	);
};
