import { Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CommunityCard, Loading } from '../../components';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useFetchPostsByCommunity, useGetCommunity } from '../../hooks';
import { CommunityT } from '../../types';

export function Community() {
	const { communityId } = useParams<{ communityId: string }>();
	const { user: currentUser } = useAuth();
	const { data: posts, isLoading: isPostLoading } = useFetchPostsByCommunity(communityId as string);

	const { data, isLoading } = useGetCommunity(communityId as string);

	if (isLoading || isPostLoading) return <Loading />;

	return (
		<Grid container spacing={2}>
			<Grid
				size={{ xs: 12, lg: 4, xl: 3 }}
				order={{ xs: 1, lg: 2 }}
				sx={{ position: { lg: 'sticky' }, top: { lg: '20px' }, alignSelf: { lg: 'flex-start' } }}>
				<CommunityCard community={data as CommunityT} />
			</Grid>
			<Grid size={{ xs: 12, lg: 8, xl: 9 }} order={{ xs: 2, lg: 1 }}>
				{posts && posts.length > 0 ? (
					<Stack gap={2}>
						{posts.map((post, index) => (
							<PostItem key={index} post={post} user={currentUser} />
						))}
					</Stack>
				) : (
					<Typography variant='body1' textAlign='center' color='text.secondary'>
						No posts yet. Be the first to create a post!
					</Typography>
				)}
			</Grid>
		</Grid>
	);
}
