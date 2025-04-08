import {
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid2 as Grid,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FriendshipActionBtn } from '../../components';
import { useAuth } from '../../contexts';
import { UserInfoDTO } from '../../types';
import BlockUserBtn from '../../components/common/BlockUserBtn';
import { useBlockContext } from '../../contexts/useBlockContext';
import UnBlockUserBtn from '../../components/common/UnBlockUserBtn';

// Helper function to get the default profile image based on gender
const getDefaultProfileImage = (gender: string) => {
	switch (gender.toLowerCase()) {
		case 'male':
			return '/images/profiles/male.webp';
		case 'female':
			return '/images/profiles/female.webp';
		case 'non-binary':
			return '/images/profiles/nonbinary.webp';
		default:
			return '/images/profiles/unknown.webp'; // For 'prefer not to say' or other cases
	}
};

interface PropsI {
	user: UserInfoDTO;
}

export function Profile({ user }: PropsI) {
	const { user: currentUser } = useAuth();
	const isCurrentUser = useMemo(() => user.id === currentUser?.id, [user, currentUser]);

	// const [user, setUser] = useState<UserInfoDTO | null>(null);
	// const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate(); // Initialize navigate

    const { blockedUserIds } = useBlockContext();
    const [ isBlocked, setIsBlocked ] = useState(false);

    useEffect(() => {
        if (blockedUserIds.includes(user.id)) {
            setIsBlocked(true);
        }
    }, [blockedUserIds, user.id])

    function handleBlock() {
        if (isBlocked) {
            setIsBlocked(false);
        } else {
            setIsBlocked(true);
        }
    }

	// useEffect(() => {
	// 	const auth = getAuth();
	// 	const userId = auth.currentUser?.uid || ''; // Get the current user's ID

	// 	if (userId) {
	// 		getUserInfo(userId)
	// 			.then((userData: UserInfoDTO) => {
	// 				setUser(userData);
	// 				setLoading(false);
	// 			})
	// 			.catch((error: any) => {
	// 				console.error('Error fetching user info:', error);
	// 				setLoading(false);
	// 			});
	// 	} else {
	// 		console.error('No user is logged in.');
	// 		setLoading(false);
	// 	}
	// }, []);

	const handleChangePassword = () => {
		const auth = getAuth();
		const user = auth.currentUser;

		if (!user || !currentPassword || !newPassword || !confirmPassword) {
			setError('All fields are required.');
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		// Reauthenticate the user with the current password
		const credential = EmailAuthProvider.credential(user.email!, currentPassword);
		reauthenticateWithCredential(user, credential)
			.then(() => {
				// Update password
				return updatePassword(user, newPassword);
			})
			.then(() => {
				setError('');
				alert('Password changed successfully!');
				setOpenDialog(false);
			})
			.catch(error => {
				setError('Failed to change password. Please check your credentials.');
				console.error(error);
			});
	};

	// if (loading) {
	// 	return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>;
	// }

	// Check if user.dob is a string or Date, then parse accordingly
	// const dob = user?.dob instanceof Date ? user.dob : new Date(user?.dob ?? '');

	// Determine the profile image, either the user-provided one or the default based on gender
	const profileImageUrl = user?.profileImageUrl || getDefaultProfileImage(user?.gender || '');

	const handleEditProfile = () => {
		navigate('/profile/editprofile'); // Redirect to the edit profile page
	};

	const profileActions = !isCurrentUser ? (
        <>
            <FriendshipActionBtn userId={user.id} />
            { isBlocked ? <UnBlockUserBtn action={handleBlock} blockedUserId={user.id} /> : <BlockUserBtn action={handleBlock} blockedUserId={user.id} />}
        </>

	) : (
		<Stack direction='row' gap={2}>
			<Button variant='contained' onClick={handleEditProfile} fullWidth>
				Edit Profile
			</Button>

			<Button variant='contained' onClick={() => setOpenDialog(true)} fullWidth>
				Change Password
			</Button>
		</Stack>
	);

	return (
		user && (
			<Card
				sx={{
					position: 'relative',
					p: { xs: 2, md: 4, lg: 3 },
					backgroundColor: '#f0f4f8',
					boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
				}}>
				<Chip
					label={user.role}
					sx={{ position: 'absolute', top: 20, right: 15 }}
					color={user.role === 'Admin' ? 'secondary' : 'info'}
				/>
				<Grid container spacing={2}>
					<Grid size={{ xs: 4, lg: 12 }}>
						<Avatar
							src={profileImageUrl}
							alt='Profile Picture'
							sx={{
								width: { xs: '100%', sm: '80%' },
								height: 'auto',
								margin: '0 auto',
								boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
							}}
						/>
					</Grid>
					<Grid size={{ xs: 8, lg: 12 }}>
						<Stack gap={1} justifyContent='center'>
							<Stack direction='row' alignItems='baseline' columnGap={2} flexWrap='wrap'>
								<Typography variant='h5' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
									{`${user.firstName} ${user.lastName}`}
								</Typography>
								<Typography sx={{ color: 'text.secondary' }}>{user.email}</Typography>
							</Stack>

							<Stack
								direction='row'
								alignItems='baseline'
								columnGap={2}
								flexWrap='wrap'
								sx={{ color: '#555' }}>
								<Typography sx={{ fontWeight: 'bold' }}>Bio:</Typography>
								<Typography>{user.bio || 'N/A'}</Typography>
							</Stack>

							<Stack
								direction='row'
								alignItems='baseline'
								columnGap={2}
								flexWrap='wrap'
								sx={{ color: '#555' }}>
								<Typography sx={{ fontWeight: 'bold' }}>Gender:</Typography>
								<Typography>{user.gender}</Typography>
							</Stack>

							<Stack
								direction='row'
								alignItems='baseline'
								columnGap={2}
								flexWrap='wrap'
								sx={{ color: '#555' }}>
								<Typography sx={{ fontWeight: 'bold' }}>Date of Birth:</Typography>
								<Typography>{user.dob || 'N/A'}</Typography>
							</Stack>

							<Box mt={1} display={{ xs: 'none', md: 'block' }}>
								{profileActions}
							</Box>
						</Stack>
					</Grid>

					<Grid size={12} display={{ xs: 'block', md: 'none' }}>
						{profileActions}
					</Grid>
				</Grid>

				{/* Change Password Dialog */}
				<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
					<DialogTitle>Change Password</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To change your password, please enter your current password and a new password.
						</DialogContentText>
						<TextField
							autoFocus
							margin='dense'
							label='Current Password'
							type='password'
							fullWidth
							variant='outlined'
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='New Password'
							type='password'
							fullWidth
							variant='outlined'
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='Confirm New Password'
							type='password'
							fullWidth
							variant='outlined'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
						/>
						{error && (
							<Typography color='error' sx={{ mt: 2 }}>
								{error}
							</Typography>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpenDialog(false)} color='secondary'>
							Cancel
						</Button>
						<Button onClick={handleChangePassword} variant='contained' color='primary'>
							Change Password
						</Button>
					</DialogActions>
				</Dialog>
			</Card>
		)
	);
}

export default Profile;
