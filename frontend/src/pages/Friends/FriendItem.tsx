import { ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { CloseFriendBtn, DeleteFriendBtn, UserAvatar } from '../../components';
import { FriendshipT } from '../../types';

interface PropsI {
	friendship: FriendshipT;
}

export function FriendItem({ friendship }: PropsI) {
	const navigate = useNavigate();
	const {
		friend,
		friend: { id, firstName, lastName, email, bio },
	} = friendship;

	return (
		<ListItem
			onClick={() => navigate(`/profile/${id}`)}
			sx={{
				transition: '0.5s',
				'&:hover': { bgcolor: grey[100], cursor: 'pointer' },
			}}
			alignItems='flex-start'
			secondaryAction={<DeleteFriendBtn friendId={id} />}>
			{/* userAvatar */}
			<ListItemAvatar>
				<UserAvatar user={friend} />
			</ListItemAvatar>

			{/* userInfo */}
			<ListItemText
				primary={
					<Stack direction='row' gap={2} alignItems='center'>
						<Typography variant='h6'>
							{firstName} {lastName}
						</Typography>
						<CloseFriendBtn friendship={friendship} />
					</Stack>
				}
				secondary={
					<Stack component={'span'} gap={1}>
						<Typography component='span' variant='body2'>
							{email}
						</Typography>
						<Typography component='span' sx={{ color: 'text.primary' }}>
							{bio || 'No bio available'}
						</Typography>
					</Stack>
				}
			/>
		</ListItem>
	);
}
