import { Box, Tab, Tabs } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { a11yProps, TabPanel } from '../../components';
import { searchQueryKeys } from '../../consts';
import { revertObjectKeyValue } from '../../utils';
import { CommunitySearchResultList } from './CommunitySearchResultList';
import { PostSearchResultList } from './PostSearchResultList';
import { UserSearchResultList } from './UserSearchResultList';

const tabOptions = {
	posts: 0,
	communities: 1,
	users: 2,
};

const reverseTabOptions = revertObjectKeyValue(tabOptions);

export function Search() {
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
	const currentTab = useMemo(() => searchParams.get('tab'), [searchParams]);
	const currentTabIndex = useMemo(
		() => (currentTab ? tabOptions[currentTab as keyof typeof tabOptions] : tabOptions.posts),
		[currentTab]
	);

	useEffect(() => () => queryClient.removeQueries({ queryKey: searchQueryKeys.all }), []);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		const newTab = reverseTabOptions[newValue];
		setSearchParams({ q: query, tab: newTab });
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={currentTabIndex} onChange={handleChange} aria-label='basic tabs example'>
					<Tab label='Posts' {...a11yProps(0)} />
					<Tab label='Communities' {...a11yProps(1)} />
					<Tab label='Users' {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={currentTabIndex} index={0}>
				<PostSearchResultList query={query} />
			</TabPanel>
			<TabPanel value={currentTabIndex} index={1}>
				<CommunitySearchResultList query={query} />
			</TabPanel>
			<TabPanel value={currentTabIndex} index={2}>
				<UserSearchResultList query={query} />
			</TabPanel>
		</Box>
	);
}
