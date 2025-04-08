import { Alert, Divider, List, Stack, Typography } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { Loading } from '../../components';
import { useAuth } from '../../contexts';
import { useSearchUsers } from '../../hooks';
import { UserSearchResultItem } from './UserSearchResultItem';

interface PropsI {
	query: string;
}

export function UserSearchResultList({ query }: PropsI) {
	const { user: currentUser } = useAuth();

	const { data: results, isLoading, isError } = useSearchUsers(query);

	const resultCount = useMemo(() => {
		if (!results) return 'No result';
		const count = currentUser ? results?.filter(user => user.id != currentUser?.id).length : results?.length;
		return `${count} ${count > 1 ? 'results' : 'result'}`;
	}, [results]);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (!results?.length) return <Alert severity='info'>No users found.</Alert>;

	return (
		<Stack gap={1}>
			<Typography gutterBottom>
				{resultCount} for "{query}":
			</Typography>

			<List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
				{results.map(
					(user, index) =>
						user.id != currentUser?.id && (
							<Fragment key={user.id}>
								<UserSearchResultItem user={user} />
								{index !== results.length - 1 && <Divider />}
							</Fragment>
						)
				)}
			</List>
		</Stack>
	);
}
