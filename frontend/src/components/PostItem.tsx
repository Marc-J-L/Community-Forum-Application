import { Comment, Delete, Edit, ExpandMore, Group, Lock, Public, ThumbDown, ThumbUp } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'; // Firestore
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeletePost } from '../hooks/apiHooks/post/useDeletePost';
import { useDislikePost } from '../hooks/apiHooks/post/useDislikePost';
import { useEditPost } from '../hooks/apiHooks/post/useEditPost';
import { useLikePost } from '../hooks/apiHooks/post/useLikePost';
import { Post } from '../types/post.type';
import { UserInfoDTO } from '../types/user.type';
import CommentSection from './CommentSection';
import EditPostDialogue from './EditPostDialogue';
import { UserAvatar } from './UserAvatar';

interface PostProps {
	post: Post;
	user: UserInfoDTO | null;
}

const PostItem: React.FC<PostProps> = ({ post, user }) => {
	const navigate = useNavigate();
	const { mutate: deletePost } = useDeletePost(post.postId);
	const { mutate: editPost } = useEditPost(post.postId);
	const [isEditDialogOpen, setEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [postImages, setPostImages] = useState(post.images || []);
	const [isCommentsOpen, setCommentsOpen] = useState(false); // State for accordion open/close
	const [commentCount, setCommentCount] = useState(0); // State for comment count
	const { likePostMutation, unlikePostMutation } = useLikePost(post.postId);
	const { dislikePostMutation, undislikePostMutation } = useDislikePost(post.postId);

	const queryClient = useQueryClient();

	const userId = user?.id;
	let hasLiked: boolean = false;
	let hasDisliked: boolean = false;

	if (userId) {
		hasLiked = post.likes.includes(userId);
		hasDisliked = post.dislikes.includes(userId);
	}

	const isOwner = user != null ? user.id === post.authorId : false; // Check if the user owns the post
	const isAdmin = user != null ? user.role === 'Admin' : false;

	// Fetch the comment count for the post from Firestore
	useEffect(() => {
		const fetchCommentCount = async () => {
			try {
				const firestore = getFirestore();
				const commentsCollection = collection(firestore, 'comments');
				const q = query(commentsCollection, where('PostId', '==', post.postId));
				const querySnapshot = await getDocs(q);

				setCommentCount(querySnapshot.size); // Set the comment count based on Firestore query result
			} catch (error) {
				console.error('Error fetching comment count:', error);
			}
		};

		fetchCommentCount();
	}, [post.postId]); // Run this effect when the postId changes

	// Handle deletion of a post
	const handleDelete = () => {
		deletePost(post.postId, {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
				queryClient.invalidateQueries({ queryKey: ['posts'] });
			},
		});
	};

	// Handle submitting edited post data
	const handleEditSubmit = (data: {
		title: string;
		text: string;
		images?: string[];
		visibility: 'public' | 'private' | 'only-me';
	}) => {
		const updatedPost: Post = {
			...post, // Spread existing post object to retain unchanged fields
			title: data.title,
			text: data.text,
			images: data.images || post.images, // Keep existing images if no new ones are provided
			updatedAt: new Date(),
			visibility: data.visibility,
		};
		editPost(updatedPost, {
			onSuccess: () => {
				enqueueSnackbar('Post updated successfully!', { variant: 'success' });
				queryClient.invalidateQueries({ queryKey: ['posts'] });
				setEditDialogOpen(false); // Close the dialog after successful edit
			},
		});
	};

	// Toggle like status
	const toggleLike = () => {
		const userId = user?.id;
		if (!userId) navigate('/login');

		if (hasLiked) {
			unlikePostMutation.mutate(userId!);
		} else {
			likePostMutation.mutate(userId!);
		}
	};

	// Toggle dislike status
	const toggleDislike = () => {
		const userId = user?.id;
		if (!userId) navigate('/login');

		if (hasDisliked) {
			undislikePostMutation.mutate(userId!);
		} else {
			dislikePostMutation.mutate(userId!);
		}
	};

	// Toggle comments section visibility
	const toggleComments = () => {
		setCommentsOpen(prev => !prev);
	};

	// Navigate to PostDetail.tsx when title or text is clicked
	const navigateToPostDetail = () => {
		if (post.postId) {
			navigate(`/posts/${post.postId}`);
		}
	};

	const navigateToAuthorProfile = () => navigate(`/profile/${post.authorId}`);

	const removeImage = (index: number) => {
		const updatedImages = [...postImages];
		updatedImages.splice(index, 1); // Remove the image at the specified index
		setPostImages(updatedImages);
	};

	return (
		<Card sx={{ padding: 2, position: 'relative' }}>
			<CardContent>
				<Chip
					sx={{ position: 'absolute', top: 16, right: 16 }} // Position the chip
					icon={
						post.visibility === 'public' ? <Public /> : post.visibility === 'private' ? <Group /> : <Lock />
					}
					label={
						post.visibility === 'public' ? 'Public' : post.visibility === 'private' ? 'Friends' : 'Only Me'
					}
					color={
						post.visibility === 'public'
							? 'primary'
							: post.visibility === 'private'
							? 'secondary'
							: 'default'
					}
					variant='outlined'
				/>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
					<Stack
						sx={{
							marginRight: 2,
							width: 50,
							height: 50,
							cursor: 'pointer',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						onClick={navigateToAuthorProfile}>
						<UserAvatar name={post.authorName} />
					</Stack>
					<Typography variant='h6' onClick={navigateToAuthorProfile} sx={{ cursor: 'pointer' }}>
						{post.authorName}
					</Typography>
				</div>
				{/* Clicking on the title or text navigates to PostDetail */}
				<Typography
					variant='h5'
					gutterBottom
					onClick={navigateToPostDetail}
					sx={{
						cursor: 'pointer',
						color: '#3f51b5',
					}}>
					{post.title}
				</Typography>
				<Typography
					variant='body2'
					color='textSecondary'
					onClick={navigateToPostDetail}
					sx={{ cursor: 'pointer' }} // Make it clickable
				>
					{post.text}
				</Typography>
				{postImages?.length > 0 && (
					<div style={{ marginTop: 10 }}>
						{postImages.map((imgUrl: string, index: number) => (
							<img
								key={index}
								src={imgUrl}
								alt={`Post image ${index}`}
								style={{ maxHeight: '300px', maxWidth: '100%' }}
							/>
						))}
					</div>
				)}
				<Typography variant='caption' color='textSecondary'>
					Posted on {new Date(post.createdAt).toLocaleDateString()}
				</Typography>
				{post.updatedAt && (
					<Typography variant='caption' color='textSecondary'>
						{' | Updated on ' + new Date(post.updatedAt).toLocaleDateString()}
					</Typography>
				)}
			</CardContent>

			<CardActions>
				<IconButton onClick={toggleLike} aria-label='like' sx={{ color: hasLiked ? 'blue' : 'inherit' }}>
					<ThumbUp />
					<Typography variant='body2' sx={{ marginLeft: 1 }}>
						{post.likes.length}
					</Typography>
				</IconButton>
				<IconButton
					onClick={toggleDislike}
					aria-label='dislike'
					sx={{ color: hasDisliked ? 'red' : 'inherit' }}>
					<ThumbDown />
					<Typography variant='body2' sx={{ marginLeft: 1 }}>
						{post.dislikes.length}
					</Typography>
				</IconButton>
				{/* Clicking the comments icon will toggle the comments section */}
				<IconButton onClick={toggleComments} aria-label='comments' sx={{ marginLeft: 'auto' }}>
					<Comment />
					<Typography variant='body2' sx={{ marginLeft: 1 }}>
						{commentCount}
					</Typography>
				</IconButton>
				{(isOwner && isAdmin) || (isOwner && !isAdmin) ? (
					<>
						<IconButton onClick={() => setEditDialogOpen(true)} aria-label='edit'>
							<Edit />
						</IconButton>
						<IconButton onClick={() => setDeleteDialogOpen(true)} aria-label='delete'>
							<Delete />
						</IconButton>
					</>
				) : isAdmin ? (
					<IconButton onClick={() => setDeleteDialogOpen(true)} aria-label='delete'>
						<Delete />
					</IconButton>
				) : (
					<></>
				)}
			</CardActions>

			{/* Comments Accordion */}
			<Accordion expanded={isCommentsOpen} sx={{ width: '100%', marginTop: 1 }}>
				<AccordionSummary expandIcon={<ExpandMore />} onClick={toggleComments}>
					<Typography>Comments ({commentCount})</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{/* Fetch comments from the database */}
					<CommentSection postId={post.postId} commentCount={commentCount} />

					{/* If more than 3 comments, show "View All Comments" button
          {commentCount > 3 && (
            <Button component={Link} to={`/posts/${post.postId}`} variant="outlined">
              View All Comments
            </Button>
          )} */}
				</AccordionDetails>
			</Accordion>

			{/* Edit Post Dialog */}
			<EditPostDialogue
				isEditDialogOpen={isEditDialogOpen}
				setEditDialogOpen={setEditDialogOpen}
				images={postImages}
				removeImage={removeImage}
				handleEditSubmit={handleEditSubmit}
				title={post.title}
				text={post.text}
				visibility={post.visibility}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this post?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
						Cancel
					</Button>
					<Button onClick={handleDelete} color='secondary' variant='contained'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default PostItem;
