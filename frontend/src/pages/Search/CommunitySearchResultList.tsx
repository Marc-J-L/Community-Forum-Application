import { Alert, Divider, List, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Loading } from '../../components';
import { useSearchCommunities } from '../../hooks';
import { CommunitySearchResultItem } from './CommunitySearchResultItem';

interface PropsI {
	query: string;
}
export function CommunitySearchResultList({ query }: PropsI) {
	const { data: results, isLoading, isError } = useSearchCommunities(query);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (!results?.length) return <Alert severity='info'>No results found.</Alert>;

	return (
		<Stack gap={1}>
			<Typography gutterBottom>
				{results?.length || 0} {results?.length > 1 ? 'results' : 'result'} for "{query}":
			</Typography>

			<List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
				{results?.map((community, index) => (
					<Fragment key={index}>
						<CommunitySearchResultItem community={community} />
						{index !== results.length - 1 && <Divider />}
					</Fragment>
				))}
			</List>
		</Stack>
	);
}
