import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { a11yProps, TabPanel } from '../../components';
import { useAuth } from '../../contexts';
import { useGetFriendRequests } from '../../hooks';
import { FriendList } from './FriendList';
import { FriendRequestList } from './FriendRequestList';

export function Friends() {
	const { accessToken } = useAuth();
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

	const { data: requestsReceived } = useGetFriendRequests(accessToken as string, 'received');
	const { data: requestsSent } = useGetFriendRequests(accessToken as string, 'sent');

	return (
		<>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={tabValue} onChange={handleTabChange} variant='fullWidth'>
					<Tab label='My friends' {...a11yProps(0)} />
					<Tab label='Friend requests received' {...a11yProps(1)} />
					<Tab label='Friend requests sent' {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={tabValue} index={0}>
				<FriendList />
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<FriendRequestList friendRequests={requestsReceived || []} type='received' />
			</TabPanel>
			<TabPanel value={tabValue} index={2}>
				<FriendRequestList friendRequests={requestsSent || []} type='sent' />
			</TabPanel>
		</>
	);
}
