import {
	Box,
	Button,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apis/register.api';

const Register: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [dob, setDob] = useState('');
	const [lastName, setLastName] = useState('');
	const [gender, setGender] = useState(''); // Required field for gender
	const [customGender, setCustomGender] = useState(''); // Custom gender input if 'Other' is selected
	const [bio, setBio] = useState(''); // Optional field for bio
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	// Form validation for password matching
	const validatePasswords = () => password === confirmPassword;

	// Capitalize the first letter of firstName and lastName
	const capitalizeFirstLetter = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (!validatePasswords()) {
			setError('Passwords do not match');
			return;
		}

		const genderToSubmit = gender === 'other' ? customGender : gender;

		const role = 'User'; // Hidden field to set the role as 'User'
		try {
			const userData = {
				email,
				password,
				firstName: capitalizeFirstLetter(firstName),
				lastName: capitalizeFirstLetter(lastName),
				dob,
				gender: genderToSubmit,
				bio,
				role, // Include role
			};

			await registerUser(userData);
			enqueueSnackbar('Registration successful!', { variant: 'success' });

			setTimeout(() => navigate('/login'), 500);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
				enqueueSnackbar('Registration failed!', { variant: 'error' });
			} else {
				setError('An unknown error occurred');
			}
		}
	};

	return (
		<Container maxWidth='sm'>
			<Typography
				variant='h4'
				onClick={() => navigate('/')}
				sx={{
					mt: 8,
					mb: 2,
					cursor: 'pointer',
					textAlign: 'center',
					color: 'primary.main',
					fontWeight: 'bold',
				}}>
				OurForum
			</Typography>

			<Box
				sx={{
					mt: 4,
					p: 4,
					boxShadow: 3,
					borderRadius: 2,
					backgroundColor: 'background.paper',
				}}>
				<Typography variant='h5' align='center' gutterBottom>
					Create an Account
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label='First Name'
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
					/>

					<TextField
						label='Last Name'
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
					/>
					<TextField
						label='Date of Birth'
						type='date'
						value={dob}
						onChange={e => setDob(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						label='Email'
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
					/>

					<TextField
						label='Password'
						type='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
					/>

					<TextField
						label='Confirm Password'
						type='password'
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
						required
						error={!validatePasswords() && confirmPassword !== ''}
						helperText={!validatePasswords() && confirmPassword !== '' ? 'Passwords do not match' : ''}
					/>

					<FormControl fullWidth margin='normal' required>
						<InputLabel id='gender-label'>Gender</InputLabel>
						<Select
							labelId='gender-label'
							value={gender}
							onChange={e => setGender(e.target.value as string)}
							label='Gender'>
							<MenuItem value='male'>Male</MenuItem>
							<MenuItem value='female'>Female</MenuItem>
							<MenuItem value='non-binary'>Non-Binary</MenuItem>
							<MenuItem value='prefer-not-to-say'>Prefer Not to Say</MenuItem>
							<MenuItem value='other'>Other</MenuItem>
						</Select>
					</FormControl>

					{gender === 'other' && (
						<TextField
							label='Custom Gender'
							value={customGender}
							onChange={e => setCustomGender(e.target.value)}
							variant='outlined'
							fullWidth
							margin='normal'
							required
						/>
					)}

					<TextField
						label='Bio (Optional)'
						value={bio}
						onChange={e => setBio(e.target.value)}
						variant='outlined'
						fullWidth
						margin='normal'
					/>

					{error && (
						<Typography color='error' align='center' sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}

					<Button type='submit' variant='contained' color='primary' fullWidth size='large' sx={{ mt: 3 }}>
						Register
					</Button>

					<Typography align='center' sx={{ mt: 2 }}>
						Already have an account?{' '}
						<Button color='primary' onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
							Login here
						</Button>
					</Typography>
				</form>
			</Box>
		</Container>
	);
};

export default Register;
