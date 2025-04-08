import { ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
	path: string;
	label: string;
	icon: React.ReactNode;
	selectedIcon?: React.ReactNode;
	sx?: SxProps<Theme>;
	secondary?: React.ReactNode;
}

export function NavItem({ path, label, icon, selectedIcon = icon, sx, secondary }: NavItemProps) {
	const { pathname: currentPath } = useLocation();
	const navigate = useNavigate();

	const isSelected = path === '/' ? currentPath === path : currentPath.startsWith(path);

	return (
		<ListItem disablePadding sx={sx} secondaryAction={secondary}>
			<ListItemButton selected={isSelected} onClick={() => navigate(path)} sx={{ height: '56px' }}>
				<ListItemIcon sx={{ color: isSelected ? 'primary.main' : undefined }}>
					{isSelected ? selectedIcon : icon}
				</ListItemIcon>
				<ListItemText primary={label} />
			</ListItemButton>
		</ListItem>
	);
}
