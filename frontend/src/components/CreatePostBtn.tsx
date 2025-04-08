import { Add } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts';
import { CreatePostDialog } from './CreatePostDialogue';

export function CreatePostBtn() {
	const [open, setOpen] = useState(false);

	const { user } = useAuth();
	const authorInfo = useMemo(() => {
		return { authorId: user?.id || '', authorName: `${user?.firstName || ''} ${user?.lastName || ''}` };
	}, [user]);
	const { authorId, authorName } = authorInfo;
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<div className='actions'>
				<Tooltip title='Create a Post' aria-label='create post'>
					<Fab
						onClick={handleOpen}
						color='info'
						sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999999999 }}>
						<Add />
					</Fab>
				</Tooltip>
			</div>

			<CreatePostDialog
				authorName={authorName} // Replace with dynamic data
				authorId={authorId}
				open={open}
				onClose={handleClose}
			/>
		</>
	);
}
