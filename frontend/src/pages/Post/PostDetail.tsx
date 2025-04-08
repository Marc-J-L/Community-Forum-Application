// import { useState, useEffect } from 'react';
// import { Container, TextField, Button, Typography, Box } from '@mui/material';
// import { createComment, getPostComments } from '../../api/apis/comment.api'; // Adjust the path as needed
// import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
// import { useParams } from 'react-router-dom';
// import { Post } from '../../types/post.type'; // Import Post type
// import { Comment } from '../../types/comment.type'; // Import Comment type
// import { getAuth } from "firebase/auth"; // Firebase Auth for comment submission
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../../consts';

// export default function PostDetail() {
//     const { postId } = useParams<{ postId: string }>();
//     const [post, setPost] = useState<Post | null>(null); // Use Post type
//     const [comments, setComments] = useState<Comment[]>([]); // Use Comment array for storing comments
//     const [commentText, setCommentText] = useState('');
//     const [commentsCount, setCommentsCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const queryClient = useQueryClient();
//     // Fetch post details and comments
//     useEffect(() => {
//         async function fetchPostDetails() {
//             if (!postId) return;
//             try {
//                 const postData = await getPostDetails(postId);
//                 setPost(postData);
//                 const postComments = await getPostComments(postId);
//                 setComments(postComments);
//                 setCommentsCount(postComments.length)
//             } catch (error) {
//                 console.error("Failed to fetch post or comments:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchPostDetails();
//     }, [postId]);

//     // Handle comment submission
//     const handleCommentSubmit = async () => {
//         if (!commentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             // Ensure the user is authenticated
//             const auth = getAuth();
//             const user = auth.currentUser;
//             if (!user) {
//                 alert("You must be logged in to comment.");
//                 return;
//             }

//             const newComment: Comment = {
//                 commentId: 'new-id', // This will be replaced by a real ID from the backend
//                 postId: postId!,
//                 authorId: user.uid, // Current user's UID
//                 content: commentText,
//                 createdAt: new Date(),
//             };
//             await createComment(newComment), {
//                 onSuccess: () => {

//                   queryClient.invalidateQueries({ queryKey: [commentQueryKeys.all(postId), "posts"]});

//                 },

//               };

//             // Update comments state with the newly created comment
//             setComments((prevComments) => [...prevComments, newComment]);
//             setCommentText(''); // Clear the input after submission
//         } catch (error) {
//             console.error("Failed to submit comment:", error);
//             alert("Failed to submit comment. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) {
//         return <Typography variant="h6">Loading post...</Typography>;
//     }

//     return (
//         <Container>
//             {post ? (
//                 <Box>
//                     <Typography variant="h4">{post.title}</Typography>
//                     <Typography variant="body1">{post.text}</Typography>
//                 </Box>
//             ) : (
//                 <Typography variant="h6">Post not found</Typography>
//             )}

//             {/* Display comments */}
//             {commentsCount > 0 ? (
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5">Comments</Typography>
//                     {comments.map((comment) => (
//                         <Box key={postId} sx={{ mt: 2 }}>
//                             <Typography variant="body2">
//                                 {comment.content} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
//                             </Typography>
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography variant="body2" sx={{ mt: 4 }}>No comments yet.</Typography>
//             )}

//             {/* Add a comment */}
//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleCommentSubmit}
//                     sx={{ mt: 2 }}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit Comment'}
//                 </Button>
//             </Box>
//         </Container>
//     );
// }

// import { useState, useEffect } from 'react';
// import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
// import { createComment, getPostComments } from '../../api/apis/comment.api'; // Adjust the path as needed
// import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
// import { useParams } from 'react-router-dom';
// import { Post } from '../../types/post.type'; // Import Post type
// import { Comment } from '../../types/comment.type'; // Import Comment type
// import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth for comment submission
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../../consts';
// import { Edit, Delete } from '@mui/icons-material'; // Import the Edit and Delete icons

// export default function PostDetail() {
//     const { postId } = useParams<{ postId: string }>();
//     const [post, setPost] = useState<Post | null>(null); // Use Post type
//     const [comments, setComments] = useState<Comment[]>([]); // Use Comment array for storing comments
//     const [commentText, setCommentText] = useState('');
//     const [editCommentId, setEditCommentId] = useState<string | null>(null); // Store ID of comment being edited
//     const [editCommentText, setEditCommentText] = useState(''); // Store the comment text being edited
//     const [commentsCount, setCommentsCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [currentUser, setCurrentUser] = useState<any | null>(null); // Track the logged-in user

//     const queryClient = useQueryClient();
//     const auth = getAuth();

//     // Track auth state using onAuthStateChanged to make sure we know when the user is logged in
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user); // Set the user state when logged in
//             if (user) {
//                 console.log("PostDetail Firestore userId:", user.uid);
//                 console.log("PostDetail Firebase Auth user.uid:", user.uid);
//             }
//         });

//         return () => unsubscribe();
//     }, [auth]);

//     // Fetch post details and comments
//     useEffect(() => {
//         async function fetchPostDetails() {
//             if (!postId) return;
//             try {
//                 const postData = await getPostDetails(postId);
//                 setPost(postData);
//                 const postComments = await getPostComments(postId);
//                 setComments(postComments);
//                 setCommentsCount(postComments.length);
//             } catch (error) {
//                 console.error("PostDetail Fetch Error: Failed to fetch post or comments:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchPostDetails();
//     }, [postId]);

//     // Handle comment submission
//     const handleCommentSubmit = async () => {
//         if (!commentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             if (!currentUser) {
//                 alert("You must be logged in to comment.");
//                 return;
//             }

//             const newComment: Comment = {
//                 commentId: 'new-id', // This will be replaced by a real ID from the backend
//                 postId: postId!,
//                 UserId: currentUser.uid, // Current user's UID
//                 content: commentText,
//                 createdAt: new Date(),
//             };
//             await createComment(newComment);

//             setComments((prevComments) => [...prevComments, newComment]);
//             setCommentText(''); // Clear the input after submission
//             queryClient.invalidateQueries({ queryKey: [commentQueryKeys.all(postId), "posts"] });

//             console.log("PostDetail Comment Submitted by:", currentUser.uid);

//         } catch (error) {
//             console.error("PostDetail Comment Submission Error:", error);
//             alert("Failed to submit comment. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Handle deleting a comment
//     const handleDeleteComment = (commentId: string) => {
//         console.log(`PostDetail Deleting Comment with commentId: ${commentId}`);
//         setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
//     };

//     // Handle editing a comment
//     const handleEditComment = (commentId: string, content: string) => {
//         console.log(`PostDetail Editing Comment with commentId: ${commentId}`);
//         setEditCommentId(commentId);
//         setEditCommentText(content);
//     };

//     // Save the edited comment
//     const handleSaveEditComment = () => {
//         console.log(`PostDetail Saving Edited Comment with commentId: ${editCommentId}`);
//         setComments((prevComments) =>
//             prevComments.map((comment) =>
//                 comment.commentId === editCommentId ? { ...comment, content: editCommentText } : comment
//             )
//         );
//         setEditCommentId(null);
//         setEditCommentText('');
//     };

//     if (isLoading) {
//         return <Typography variant="h6">Loading post...</Typography>;
//     }

//     return (
//         <Container>
//             {post ? (
//                 <Box>
//                     <Typography variant="h4">{post.title}</Typography>
//                     <Typography variant="body1">{post.text}</Typography>
//                 </Box>
//             ) : (
//                 <Typography variant="h6">Post not found</Typography>
//             )}

//             {/* Display comments */}
//             {commentsCount > 0 ? (
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5">Comments</Typography>
//                     {comments.map((comment) => {
//                         const isOwner = comment.UserId === currentUser?.uid;
//                         if (isOwner) {
//                             // Log debug information
//                             console.log(`PostDetail Render Edit/Delete Buttons for commentId: ${comment.commentId}, authorId: ${comment.UserId}, currentUser.uid: ${currentUser?.uid}`);
//                         }

//                         return (
//                             <Box key={comment.commentId} sx={{ mt: 2 }}>
//                                 {editCommentId === comment.commentId ? (
//                                     <TextField
//                                         value={editCommentText}
//                                         onChange={(e) => setEditCommentText(e.target.value)}
//                                         fullWidth
//                                         multiline
//                                         rows={2}
//                                     />
//                                 ) : (
//                                     <Typography variant="body2">
//                                         {comment.content} (Posted by: {comment.UserId || 'Unknown'} at {new Date(comment.createdAt).toLocaleString()})
//                                     </Typography>
//                                 )}

//                                 {isOwner && ( // Check if the current user is the comment owner
//                                     <Box>
//                                         <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)}>
//                                             <Edit />
//                                         </IconButton>
//                                         <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
//                                             <Delete />
//                                         </IconButton>
//                                         {editCommentId === comment.commentId && (
//                                             <Button onClick={handleSaveEditComment} color="primary">
//                                                 Save
//                                             </Button>
//                                         )}
//                                     </Box>
//                                 )}
//                             </Box>
//                         );
//                     })}
//                 </Box>
//             ) : (
//                 <Typography variant="body2" sx={{ mt: 4 }}>No comments yet.</Typography>
//             )}

//             {/* Add a comment */}
//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleCommentSubmit}
//                     sx={{ mt: 2 }}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit Comment'}
//                 </Button>
//             </Box>
//         </Container>
//     );
// }

// import { useState, useEffect } from 'react';
// import { Container, Typography, Box, IconButton } from '@mui/material';
// import { createComment } from '../../api/apis/comment.api'; // Adjust the path as needed
// import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
// import { useParams } from 'react-router-dom';
// import { Post } from '../../types/post.type'; // Import Post type
// import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth for comment submission
// import { useQueryClient } from '@tanstack/react-query';
// import { Edit, Delete } from '@mui/icons-material'; // Import the Edit and Delete icons
// import FullCommentSection from '../../components/FullCommentSection'; // Import CommentSection component

// export default function PostDetail() {
//     const { postId } = useParams<{ postId: string }>();
//     const [post, setPost] = useState<Post | null>(null); // Use Post type
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentUser, setCurrentUser] = useState<any | null>(null); // Track the logged-in user
//     const [editPost, setEditPost] = useState<string | null>(null); // Store edit status for the post

//     const queryClient = useQueryClient();
//     const auth = getAuth();

//     // Track auth state using onAuthStateChanged to make sure we know when the user is logged in
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user); // Set the user state when logged in
//             if (user) {
//                 console.log("PostDetail Firestore userId:", user.uid);
//             }
//         });

//         return () => unsubscribe();
//     }, [auth]);

//     // Fetch post details
//     useEffect(() => {
//         async function fetchPostDetails() {
//             if (!postId) return;
//             try {
//                 const postData = await getPostDetails(postId);
//                 setPost(postData);
//             } catch (error) {
//                 console.error("PostDetail Fetch Error: Failed to fetch post:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchPostDetails();
//     }, [postId]);

//     if (isLoading) {
//         return <Typography variant="h6">Loading post...</Typography>;
//     }

//     return (
//         <Container>
//             {post ? (
//                 <Box>
//                     <Typography variant="h4">{post.title}</Typography>
//                     <Typography variant="body1">{post.text}</Typography>
//                     <Typography variant="caption">
//                         Posted on {new Date(post.createdAt).toLocaleDateString()}
//                     </Typography>

//                     {post.updatedAt && (
//                         <Typography variant="caption">
//                             {" | Updated on " + new Date(post.updatedAt).toLocaleDateString()}
//                         </Typography>
//                     )}

//                     {currentUser?.uid === post.authorId && (
//                         <Box sx={{ mt: 2 }}>
//                             <IconButton onClick={() => setEditPost(post.postId)} color="primary">
//                                 <Edit />
//                             </IconButton>
//                             <IconButton onClick={() => console.log('Delete post')} color="secondary">
//                                 <Delete />
//                             </IconButton>
//                         </Box>
//                     )}

//                     {/* Reuse CommentSection component here */}
//                     <Box sx={{ mt: 4 }}>
//                         <FullCommentSection postId={post.postId} />
//                     </Box>
//                 </Box>
//             ) : (
//                 <Typography variant="h6">Post not found</Typography>
//             )}
//         </Container>
//     );
// }

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Edit,
  Delete,
  ExpandMore,
  Public,
  Lock,
  Group,
} from "@mui/icons-material";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getPostDetails } from "../../api/apis/post.api";
import { useDeletePost } from "../../hooks/apiHooks/post/useDeletePost";
import { useEditPost } from "../../hooks/apiHooks/post/useEditPost";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { enqueueSnackbar } from "notistack";
import CommentSection from "../../components/FullCommentSection";
import EditPostDialogue from "../../components/EditPostDialogue";
import { Post } from "../../types/post.type";
import { useLikePost } from "../../hooks/apiHooks/post/useLikePost";
import { useDislikePost } from "../../hooks/apiHooks/post/useDislikePost";
import { useAuth } from "../../contexts";

import { ReportBtn } from "../../components/common/ReportBtn";
import { Loading, UserAvatar } from "../../components";

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [postImages, setPostImages] = useState<string[]>([]); // Track the images in the post
  const navigate = useNavigate();
  const auth = getAuth();
  const { mutate: deletePost } = useDeletePost(postId!);
  const { mutate: editPost } = useEditPost(postId!);
  const isOwner = currentUser?.uid === post?.authorId;
  const { likePostMutation, unlikePostMutation } = useLikePost(postId!);
  const { dislikePostMutation, undislikePostMutation } = useDislikePost(
    postId!
  );

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  let hasLiked: boolean = false;
  let hasDisliked: boolean = false;

  if (userId) {
    if (post !== null) {
      hasLiked = post.likes.includes(userId);
      hasDisliked = post.dislikes.includes(userId);
    }
  } else {
    console.error("User ID is not defined");
  }
  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setCurrentUser(user)
    );
    return () => unsubscribe();
  }, [auth]);

  // Fetch post details and comment count
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postId) return;
      try {
        const postData = await getPostDetails(postId);
        setPost(postData);
        setPostImages(postData.images || []); // Set the images from post data
        const firestore = getFirestore();
        const commentsCollection = collection(firestore, "comments");
        const q = query(commentsCollection, where("PostId", "==", postId));
        const querySnapshot = await getDocs(q);
        setCommentCount(querySnapshot.size);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  // Handle deletion of a post
  const handleDelete = () => {
    if (!post) return;
    deletePost(post.postId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        enqueueSnackbar("Post deleted successfully!", { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        navigate("/");
      },
    });
  };

  // Handle editing of a post
  const handleEditSubmit = (data: {
    title: string;
    text: string;
    images?: string[];
    visibility: "public" | "private" | "only-me" 
  }) => {
    if (!post) return;
    const updatedPost: Post = {
      ...post,
      title: data.title,
      text: data.text,
      images: data.images || postImages,
      updatedAt: new Date(),
      visibility: data.visibility
    };
    editPost(updatedPost, {
      onSuccess: () => {
        enqueueSnackbar("Post updated successfully!", { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setPost(updatedPost);
        setEditDialogOpen(false);
      },
    });
  };

  // Remove an image from the post
  const removeImage = (index: number) => {
    const updatedImages = [...postImages];
    updatedImages.splice(index, 1); // Remove the image at the specified index
    setPostImages(updatedImages);
  };

  // Toggle like status
  const toggleLike = () => {
    const userId = user?.id;
    if (hasLiked) {
      unlikePostMutation.mutate(userId!);
    } else {
      likePostMutation.mutate(userId!);
    }
  };

  // Toggle dislike status
  const toggleDislike = () => {
    const userId = user?.id;
    if (hasDisliked) {
      undislikePostMutation.mutate(userId!);
    } else {
      dislikePostMutation.mutate(userId!);
    }
  };

  // Toggle comments visibility
  const toggleComments = () => setCommentsOpen((prev) => !prev);

  const navigateToAuthorProfile = () => post && navigate(`/profile/${post.authorId}`);

  if (isLoading) return <Loading />;

  return (
    <Container>
      {post ? (
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            padding: 2,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Chip
            sx={{ position: "absolute", top: 16, right: 16 }} // Position the chip
            icon={
              post.visibility === "public" ? (
                <Public />
              ) : post.visibility === "private" ? (
                <Group />
              ) : (
                <Lock />
              )
            }
            label={
              post.visibility === "public"
                ? "Public"
                : post.visibility === "private"
                ? "Friends"
                : "Only Me"
            }
            color={
              post.visibility === "public"
                ? "primary"
                : post.visibility === "private"
                ? "secondary"
                : "default"
            }
            variant="outlined"
          />
          <Box display="flex" alignItems="center" mb={2}>
            <Stack
              sx={{ marginRight: 2, width: 50, height: 50, cursor: 'pointer', justifyContent: 'center', alignItems: 'center' }}
              onClick={navigateToAuthorProfile}>
              <UserAvatar name={post.authorName} />
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: "bold", cursor: 'pointer' }} onClick={navigateToAuthorProfile}>
              {post.authorName}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{ marginBottom: 1, color: "#3f51b5", fontWeight: "bold" }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: 1, color: "#616161" }}
          >
            {post.text}
          </Typography>
          {postImages?.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Post image ${index}`}
              style={{ maxWidth: "100%", marginTop: 10, borderRadius: 8 }}
            />
          ))}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", marginTop: 2 }}
          >
            Posted on {new Date(post.createdAt).toLocaleDateString()}{" "}
            {post.updatedAt &&
              `| Updated on ${new Date(post.updatedAt).toLocaleDateString()}`}
          </Typography>

          <Box mt={2} display="flex" alignItems="center">
            <IconButton
              onClick={toggleLike}
              aria-label="like"
              sx={{ color: hasLiked ? "blue" : "inherit" }}
            >
              <ThumbUp />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                {post.likes.length}
              </Typography>
            </IconButton>
            <IconButton
              onClick={toggleDislike}
              aria-label="dislike"
              sx={{ color: hasDisliked ? "red" : "inherit" }}
            >
              <ThumbDown />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                {post.dislikes.length}
              </Typography>
            </IconButton>

            <ReportBtn type="post" id={post.postId} />

            <IconButton
              onClick={toggleComments}
              aria-label="comments"
              sx={{ marginLeft: "auto" }}
            >
              <Comment />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                {commentCount}
              </Typography>
            </IconButton>
            {isOwner && (
              <IconButton
                onClick={() => setEditDialogOpen(true)}
                aria-label="edit"
                sx={{ marginLeft: 1 }}
              >
                <Edit />
              </IconButton>
            )}
            {isOwner || user?.role === "Admin" && (
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                aria-label="delete"
                sx={{ marginLeft: 1 }}
              >
                <Delete />
              </IconButton>
            )}
          </Box>

          {/* Comments Accordion */}
          <Accordion
            className="commentsAccordionSytle"
            expanded={isCommentsOpen}
            sx={{ width: "100%", marginTop: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              onClick={toggleComments}
            >
              <Typography>Comments ({commentCount})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CommentSection postId={post.postId} />
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
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this post?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="secondary"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Navigate to="/not-found" replace />
      )}
    </Container>
  );
}
