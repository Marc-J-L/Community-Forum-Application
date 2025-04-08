import {
	AccountCircleOutlined as AccountCircleOutlinedIcon,
	AccountCircleTwoTone as AccountCircleTwoToneIcon,
	AdminPanelSettings as AdminPanelSettingsIcon,
	AdminPanelSettingsOutlined as AdminPanelSettingsOutlinedIcon,
	FeedOutlined as FeedOutlinedIcon,
	FeedTwoTone as FeedTwoToneIcon,
	PeopleAltOutlined as PeopleAltOutlinedIcon,
	PeopleAltTwoTone as PeopleAltTwoToneIcon,
	Public as PublicIcon,
	PublicTwoTone as PublicTwoToneIcon,
} from '@mui/icons-material';
import { Badge, Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import React from 'react';
import { NavItem, UserCommunityList } from '../components';
import { useAuth } from '../contexts';
import { usePendingFriendRequests } from '../hooks';
import { PlaylistComponent } from './../components/ApiMusic';

const MemoizedPlaylistComponent = React.memo(PlaylistComponent);

interface PropsI {
	drawerWidth: number;
	mobileOpen: boolean;
	handleDrawerClose: () => void;
	handleDrawerTransitionEnd: () => void;
}

export function Nav({ drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd }: PropsI) {
	const { user } = useAuth();
	const pendingCount = usePendingFriendRequests(user?.id!);

	const drawer = (
		<>
			<Toolbar />
			<Divider />
			<List disablePadding>
				<NavItem path='/' label='Explore' icon={<PublicIcon />} selectedIcon={<PublicTwoToneIcon />} />

				{user && (
					<>
						<NavItem
							path='/feed'
							label='My Feed'
							icon={<FeedOutlinedIcon />}
							selectedIcon={<FeedTwoToneIcon />}
						/>
						<NavItem
							path='/friends'
							label='My Friends'
							icon={<PeopleAltOutlinedIcon />}
							selectedIcon={<PeopleAltTwoToneIcon />}
							secondary={<Badge badgeContent={pendingCount} color='error' sx={{ mx: 1 }} />}
						/>
						<NavItem
							path='/posts/me'
							label='My Posts'
							icon={<AccountCircleOutlinedIcon />}
							selectedIcon={<AccountCircleTwoToneIcon />}
						/>
						{user.role === 'Admin' && (
							<NavItem
								path='/admin'
								label='Admin Panel'
								icon={<AdminPanelSettingsOutlinedIcon />}
								selectedIcon={<AdminPanelSettingsIcon />}
							/>
						)}
					</>
				)}
			</List>

			{user && <UserCommunityList />}

			{/*add API */}
			<MemoizedPlaylistComponent />
		</>
	);

	return (
		<Box component='nav' className='nav-page' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
			<Drawer
				variant='temporary'
				open={mobileOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}>
				{drawer}
			</Drawer>
			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open>
				{drawer}
			</Drawer>
		</Box>
	);
}
