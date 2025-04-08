import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth'; // Firebase authentication
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Firestore to fetch user role
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/apis/login.api';

const Login: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			// Authenticate user with Firebase
			await loginUser(email, password);

			const auth = getAuth();
			const user = auth.currentUser;

			if (user) {
				// Get user ID and Firestore instance
				const userId = user.uid;
				const db = getFirestore();

				// Fetch user's document from the 'users' collection
				const userDocRef = doc(db, 'users', userId);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					const userData = userDoc.data();
					const userRole = userData?.Role;

					// Check if the user role is 'Suspended'
					if (userRole === 'Suspended') {
						enqueueSnackbar('Your account is suspended. Please contact support.', { variant: 'warning' });
						await getAuth().signOut(); // Sign the user out
						return; // Prevent further navigation
					}

					// Proceed if the user is not suspended
					enqueueSnackbar('Login successful!', { variant: 'success' });
					navigate('/'); // Redirect to homepage
				} else {
					setError('User not found');
				}
			} else {
				setError('No user is logged in.');
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
				enqueueSnackbar('Login failed!', { variant: 'error' });
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
					Welcome Back
				</Typography>
				<form onSubmit={handleLogin}>
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

					{error && (
						<Typography color='error' align='center' sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}

					<Button type='submit' variant='contained' color='primary' fullWidth size='large' sx={{ mt: 3 }}>
						Login
					</Button>

					<Typography align='center' sx={{ mt: 2 }}>
						Don't have an account?{' '}
						<Button color='primary' onClick={() => navigate('/register')} sx={{ textTransform: 'none' }}>
							Register here
						</Button>
					</Typography>
				</form>
			</Box>
		</Container>
	);
};

export default Login;
