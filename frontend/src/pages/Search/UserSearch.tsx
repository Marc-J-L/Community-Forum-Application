import { useState } from 'react';
import  { useSearchUsers }  from '../../hooks/apiHooks/search/useSearchUsers'
import { TextField, List, ListItem, CircularProgress, Alert } from '@mui/material';

export function UserSearch() {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: users, isLoading, isError } = useSearchUsers(searchTerm);

	return (
		<div>
			<TextField
				label="Search Users"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				fullWidth
				margin="normal"
			/>

			{isLoading && <CircularProgress />}

			{isError && <Alert severity="error">Error loading users</Alert>}

			{users?.length ? (
				<List>
					{users.map((user) => (
						<ListItem key={user.id}>
							{user.firstName} {user.lastName} - {user.email}
						</ListItem>
					))}
				</List>
			) : (
				!isLoading && <Alert severity="info">No users found</Alert>
			)}
		</div>
	);
}