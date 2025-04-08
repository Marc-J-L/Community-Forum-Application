import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { UserAvatar } from './UserAvatar';

export function UserAvatarMenu() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	const handleViewProfile = () => {
		handleCloseUserMenu();
		navigate('/profile');
	};

	return (
		user && (
			<Box sx={{ flexGrow: 0 }}>
				<Tooltip title={user.email}>
					<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
						<UserAvatar user={user} />
					</IconButton>
				</Tooltip>
				<Menu
					disableScrollLock={true}
					sx={{ mt: '45px' }}
					anchorEl={anchorElUser}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}>
					{/* <MenuItem
						onClick={() => {
							handleCloseUserMenu();
							navigate('/user');
						}}>
						<Typography>User Space</Typography>
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleCloseUserMenu();
							// navigate('/user/settings');
						}}>
						<Typography>Settings</Typography>
					</MenuItem>
					<Divider /> */}
					<MenuItem onClick={handleViewProfile}>
						<Typography>View Profile</Typography>
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<Typography>Logout</Typography>
					</MenuItem>
				</Menu>
			</Box>
		)
	);
}
