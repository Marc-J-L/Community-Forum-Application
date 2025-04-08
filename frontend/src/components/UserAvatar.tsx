import { Avatar, SxProps, Theme } from '@mui/material';
import { UserInfoDTO } from '../types';

interface Props {
	user?: UserInfoDTO;
	name?: string;
	sx?: SxProps<Theme>;
}

export function UserAvatar({ user, name, sx }: Props) {
	function stringToColor(string: string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name: string) {
		return {
			sx: {
				bgcolor: stringToColor(name),
				fontSize: '1rem',
				...sx,
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

	const fullName = user ? `${user.firstName} ${user.lastName}` : name;

	return (
		<>
			{user?.profileImageUrl ? (
				<Avatar alt={user?.email || ''} src={user?.profileImageUrl || ''} sx={{ ...sx }} />
			) : (
				<Avatar {...stringAvatar(fullName || 'Unknown User')} />
			)}
		</>
	);
}
