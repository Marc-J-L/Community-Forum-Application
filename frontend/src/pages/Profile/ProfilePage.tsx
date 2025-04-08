import { Grid2 as Grid, Stack, Typography } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { Loading } from '../../components';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useFetchPostsByUser, useGetUserInfo } from '../../hooks';
import { UserInfoDTO } from '../../types';
import Profile from './Profile';

export function ProfilePage() {
	const { id } = useParams<{ id: string }>();
	const { user: currentUser } = useAuth();

	const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserInfo(id);
	const { data: posts, isLoading: isPostLoading, isError: isPostError } = useFetchPostsByUser(id);

	if (isUserLoading || isPostLoading) return <Loading />;

	if (isUserError || isPostError) return <Navigate to='/server-error' />;

	return (
		<Grid container spacing={2}>
			<Grid size={{ xs: 12, lg: 4, xl: 3 }} order={{ xs: 1, lg: 2 }}>
				<Profile user={user as UserInfoDTO} />
			</Grid>
			<Grid size={{ xs: 12, lg: 8, xl: 9 }} order={{ xs: 2, lg: 1 }}>
				{posts && posts.length > 0 ? (
					<Stack gap={2}>
						{posts.map((post, index) => (
							<PostItem key={index} post={post} user={currentUser} />
						))}
					</Stack>
				) : (
					<Typography variant='body1' textAlign='center' color='text.secondary' my={3}>
						{!id ? 'You have ' : 'This user has '} not posted anything yet.
					</Typography>
				)}
			</Grid>
		</Grid>
	);
}
