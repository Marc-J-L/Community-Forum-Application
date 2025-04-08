import { Forum as ForumIcon } from '@mui/icons-material';
import {
	Avatar,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	SxProps,
	Theme,
	Tooltip,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCommunityT } from '../types';
import { UserCommunityStarBtn } from './common';

interface PropsI {
	community: UserCommunityT;
	sx?: SxProps<Theme>;
}

export function UserCommunityItem({ community, sx }: PropsI) {
	const navigate = useNavigate();

	return (
		<ListItem disablePadding sx={sx}>
			<ListItemButton onClick={() => navigate(`/community/${community.id}`)}>
				<ListItemIcon>
					<Avatar>
						<ForumIcon />
					</Avatar>
				</ListItemIcon>
				<ListItemText
					primary={
						<Tooltip title={community.name}>
							<Typography noWrap>{community.name}</Typography>
						</Tooltip>
					}
				/>

				<UserCommunityStarBtn community={community} />
			</ListItemButton>
		</ListItem>
	);
}
