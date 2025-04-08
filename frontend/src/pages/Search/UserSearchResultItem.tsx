import { ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { FriendshipActionBtn, UserAvatar } from '../../components';
import { UserInfoDTO } from '../../types';

interface PropsI {
	user: UserInfoDTO;
}

export function UserSearchResultItem({ user }: PropsI) {
	const navigate = useNavigate();
	const { id, firstName, lastName, email, bio } = user;

	return (
		<ListItem
			onClick={() => navigate(`/profile/${id}`)}
			sx={{
				transition: '0.5s',
				'&:hover': { bgcolor: grey[100], cursor: 'pointer' },
			}}
			alignItems='flex-start'
			secondaryAction={<FriendshipActionBtn userId={id} />}>
			{/* userAvatar */}
			<ListItemAvatar>
				<UserAvatar user={user} />
			</ListItemAvatar>

			{/* userInfo */}
			<ListItemText
				primary={
					<Typography variant='h6'>
						{firstName} {lastName}
					</Typography>
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
