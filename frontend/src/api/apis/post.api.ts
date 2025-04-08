import { AxiosResponse } from 'axios';
import { Post } from '../../types/post.type';
import { POST_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

const LIMIT = 5;

// Fetch all posts with pagination
export const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
	const url = `${POST_ENDPOINT}?limit=${LIMIT}&page=${pageParam}`;
	const res = await sendRequest({
		endpoint: url,
		method: 'GET',
	});

	return res;
};

//Fetch the posts by author
export const fetchPostsByUser = async (userId: string, currentUserId?: string) => {
	let url = `${POST_ENDPOINT}/userId/${userId}`;
	if (currentUserId) {
		url += `?currentUserId=${currentUserId}`;
	}

	const res = await sendRequest({
		endpoint: url,
		method: 'GET',
	});

	return res.data as Post[];
};

//Fetch the posts by community
export const fetchPostsByCommunity = async (communityId: string, currentUserId?: string) => {
	let url = `${POST_ENDPOINT}/communityId/${communityId}`;
	if (currentUserId) {
		url += `?currentUserId=${currentUserId}`;
	}

	const res = await sendRequest({
		endpoint: url,
		method: 'GET',
	});

	return res.data as Post[];
};

//Fetch the posts that are visible by author only
export const fetchOnlyMePosts = async (userId: string): Promise<AxiosResponse<Post[]>> => {
	const url = `${POST_ENDPOINT}/only-me?userId=${userId}`;
	const res = await sendRequest({
		endpoint: url,
		method: 'GET',
	});
	console.log('Fetched posts: ', res.data, userId);
	return res;
};
//fetch private posts from friends
export const fetchPrivatePosts = async (userId: string): Promise<AxiosResponse<Post[]>> => {
	const url = `${POST_ENDPOINT}/private?userId=${userId}`;
	const res = await sendRequest({
		endpoint: url,
		method: 'GET',
	});
	console.log('Fetched posts: ', res.data, userId);
	return res;
};
// Create a new post
export const createPostRequest = async (postData: Post) => {
	return sendRequest({
		endpoint: `${POST_ENDPOINT}/create`,
		method: 'POST',
		body: postData,
	});
};

// Delete a post
export const deletePostRequest = async (postId: string) => {
	const res = await sendRequest({
		endpoint: `${POST_ENDPOINT}/delete/${postId}`,
		method: 'DELETE',
	});

	return res.data.message;
};

// Edit an existing post
export const editPostRequest = async (postData: Post) => {
	return sendRequest({
		endpoint: `${POST_ENDPOINT}/${postData.postId}`,
		method: 'PUT',
		body: postData, // Make sure 'postData' includes all necessary fields
	});
};

// Fetch Post details
export const getPostDetails = async (postId: string) => {
	const url = `${POST_ENDPOINT}/${postId}`;
	const res = await sendRequest({ method: 'GET', endpoint: url });
	return res.data;
};

// Fetch posts by date
export const fetchPostsByDate = async (selectedDate: string): Promise<Post[]> => {
	try {
		const url = `${POST_ENDPOINT}/by-date?date=${selectedDate}`;
		const res = await sendRequest({
			endpoint: url,
			method: 'GET',
		});

		return res.data;
	} catch (error) {
		console.error('Error fetching posts by date: ', error); // Log any errors
		throw new Error('Failed to fetch posts by date.');
	}
};

// Fetch post counts for the last five days
// export const fetchPostCountsLastFiveDays = async (): Promise<Record<string, number>> => {
//   const response = await fetch('/posts/counts/last-5-days');
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };
export const fetchPostCountsLastFiveDays = async (): Promise<Record<string, number>> => {
	try {
		const url = `${POST_ENDPOINT}/counts/last-5-days`; // Replace with the actual endpoint
		const res = await sendRequest({
			endpoint: url,
			method: 'GET',
		});

		return res.data; // Assuming the response data is an array of PostCount objects
	} catch (error) {
		console.error('Error fetching post counts for last five days: ', error); // Log any errors
		throw new Error('Failed to fetch post counts for last five days.');
	}
};

// Like a post
export const likePost = async (postId: string, userId: string) => {
	return sendRequest({
		method: 'POST',
		endpoint: `${POST_ENDPOINT}/like?userId=${userId}&postId=${postId}`,
	});
};

// Unlike a post
export const unlikePost = async (postId: string, userId: string) => {
	return sendRequest({
		method: 'DELETE',
		endpoint: `${POST_ENDPOINT}/like?userId=${userId}&postId=${postId}`,
	});
};

// Dislike a post
export const dislikePost = async (postId: string, userId: string) => {
	return sendRequest({
		method: 'POST',
		endpoint: `${POST_ENDPOINT}/dislike?userId=${userId}&postId=${postId}`,
	});
};

// Remove dislike from a post
export const undislikePost = async (postId: string, userId: string) => {
	return sendRequest({
		method: 'DELETE',
		endpoint: `${POST_ENDPOINT}/dislike?userId=${userId}&postId=${postId}`,
	});
};
