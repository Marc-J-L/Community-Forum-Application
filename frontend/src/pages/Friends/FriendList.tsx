import { Alert, Divider, List, Stack, Typography } from '@mui/material';
import { Fragment } from 'react/jsx-runtime';
import { Loading } from '../../components';
import { useAuth } from '../../contexts';
import { useGetFriendships } from '../../hooks';
import { FriendItem } from './FriendItem';

export function FriendList() {
	const { accessToken } = useAuth();
	const { data: friendships, isLoading, isError } = useGetFriendships(accessToken as string);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (!friendships?.length)
		return (
			<Typography variant='body1' textAlign='center' color='text.secondary'>
				You don't have any friends yet.
			</Typography>
		);

	return (
		<Stack gap={2}>
			<Typography gutterBottom>
				{friendships?.length || 0} {friendships?.length > 1 ? 'friends' : 'friend'}:
			</Typography>

			<List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
				{friendships?.map((friendship, index) => (
					<Fragment key={index}>
						<FriendItem friendship={friendship} />
						{index !== friendships.length - 1 && <Divider />}
					</Fragment>
				))}
			</List>
		</Stack>
	);
}
