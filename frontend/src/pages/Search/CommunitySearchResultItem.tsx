import { Forum as ForumIcon } from '@mui/icons-material';
import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { JoinCommunityBtn, LeaveCommunityBtn } from '../../components';
import { useUserCommunityRelationship } from '../../hooks';
import { CommunityT } from '../../types';

interface PropsI {
	community: CommunityT;
}

export function CommunitySearchResultItem({ community }: PropsI) {
	const navigate = useNavigate();
	const { id, name, userCount, description } = community;
	const { isJoined, isCreator } = useUserCommunityRelationship(id);

	return (
		<ListItem
			onClick={() => navigate(`/community/${id}`)}
			sx={{ transition: '0.5s', '&:hover': { bgcolor: grey[100], cursor: 'pointer' } }}
			alignItems='flex-start'
			// secondaryAction={
			// 	isCreator ? (
			// 		<Tooltip title='You cannot leave your own community'>
			// 			<span>
			// 				<Button disabled size='small'>
			// 					Joined
			// 				</Button>
			// 			</span>
			// 		</Tooltip>
			// 	) : isJoined ? (
			// 		<LeaveCommunityBtn community={community} />
			// 	) : (
			// 		<JoinCommunityBtn community={community} isJoined={!!isJoined} />
			// 	)
			// }>
		>
			<ListItemAvatar>
				<Avatar>
					<ForumIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={<Typography variant='h6'>{name}</Typography>}
				secondary={
					<Stack component={'span'} gap={1}>
						<Typography component='span' variant='body2'>
							{userCount} {userCount > 1 ? 'members' : 'member'}
						</Typography>
						<Typography component='span' sx={{ color: 'text.primary' }}>
							{description}
						</Typography>
					</Stack>
				}
			/>

			<Box alignSelf='center' pl={2}>
				{isCreator ? (
					<Tooltip title='You cannot leave your own community'>
						<span>
							<Button disabled size='small'>
								Joined
							</Button>
						</span>
					</Tooltip>
				) : isJoined ? (
					<LeaveCommunityBtn community={community} />
				) : (
					<JoinCommunityBtn community={community} isJoined={!!isJoined} />
				)}
			</Box>
		</ListItem>
	);
}
