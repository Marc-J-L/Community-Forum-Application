// import { useQuery } from '@tanstack/react-query';
// import { getPostComments } from '../../../api/apis/comment.api'; // Adjust path if needed


// export const useFetchComments = (postId: string) => {
//   return useQuery({
//     queryKey: ['comments', postId],
//     queryFn: () => getPostComments(postId),
//     retry: false, // Prevents retry on failure
    
//   });
// };

import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { Comment } from '../../../types/comment.type'; // Adjust the path as needed

// Fetch comments from Firestore
const fetchComments = async (postId: string): Promise<Comment[]> => {
    const firestore = getFirestore(); // Initialize Firestore
    const commentsCollection = collection(firestore, 'comments'); // Access the 'comments' collection
    const q = query(commentsCollection, where('PostId', '==', postId)); // Query to get comments by postId
    const querySnapshot = await getDocs(q); // Execute the query

    const comments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            commentId: doc.id, // Firestore document ID
            postId: data.PostId, // Post ID from Firestore
            UserId: data.UserId, // User ID from Firestore
            content: data.Content, // Comment content from Firestore
            createdAt: data.CreatedAt.toDate(), // Convert Firestore timestamp to JS Date
            updatedAt: data.UpdatedAt ? data.UpdatedAt.toDate() : null, // Handle optional update timestamp
        } as Comment;
    });

    return comments;
};

// React Query hook that uses fetchComments function to retrieve comments
export const useFetchComments = (postId: string) => {
    return useQuery({
        queryKey: ['comments', postId], // Unique key for caching comments by postId
        queryFn: () => fetchComments(postId), // Call the fetchComments function to retrieve data
        retry: false, // Prevents retry on failure
    });
};
