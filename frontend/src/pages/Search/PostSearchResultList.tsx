import { Alert, List, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../../components';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useSearchPosts } from '../../hooks';

interface PropsI {
	query: string;
}

export function PostSearchResultList({ query }: PropsI) {
	const [searchParams, _setSearchParams] = useSearchParams();
	const { user } = useAuth();
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const limit = useMemo(() => parseInt(searchParams.get('limit') || '5', 10), [searchParams]);

	const { data: results, isLoading, isError } = useSearchPosts(query, page, limit);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (!results?.length) return <Alert severity='info'>No results found.</Alert>;

	return (
		<Stack gap={1}>
			<Typography gutterBottom>
				{results?.length || 0} {results?.length > 1 ? 'results' : 'result'} for "{query}":
			</Typography>

			<List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
				{results?.map((post, index) => (
					<PostItem key={index} post={post} user={user} />
				))}
			</List>
		</Stack>
	);
}
