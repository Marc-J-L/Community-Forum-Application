import { Box, CssBaseline, Stack, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CreatePostBtn } from '../components';
import { useAuth } from '../contexts';
import { Footer } from './Footer';
import { Header } from './Header';
import { Nav } from './Nav';

const drawerWidth = 240;

export function MainLayout() {
	const { user } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<CssBaseline />
			<Header handleDrawerToggle={handleDrawerToggle} />

			<Nav
				drawerWidth={drawerWidth}
				mobileOpen={mobileOpen}
				handleDrawerClose={handleDrawerClose}
				handleDrawerTransitionEnd={handleDrawerTransitionEnd}
			/>

			<Stack component='main' sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
				<Toolbar />

				<Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
					<Box sx={{ flexGrow: 1, p: 3 }}>
						<Outlet />
					</Box>

					<Footer />
				</Stack>

				{user && <CreatePostBtn />}
			</Stack>
		</Box>
	);
}
