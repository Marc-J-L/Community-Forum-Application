export const searchQueryKeys = {
	all: ['search'] as const,
	communities: (query: string) => [...searchQueryKeys.all, 'communities', query] as const,
	users: (query: string) => [...searchQueryKeys.all, 'users', query] as const,
	posts: (query: string) => [...searchQueryKeys.all, 'posts', query] as const,
};

export const userCommunityQueryKeys = {
	all: ['userCommunities'] as const,
	joined: () => [...userCommunityQueryKeys.all, 'joined'] as const,
	owned: () => [...userCommunityQueryKeys.all, 'owned'] as const,
};

export const communityQueryKeys = {
	all: ['communities'] as const,
	current: (communityId: string) => [...communityQueryKeys.all, 'current', communityId] as const,
};

export const commentQueryKeys = {
	all: (postId: string | undefined) => ['comment', postId] as const,
};

export const friendRequestQueryKeys = {
	all: ['friendRequest'] as const,
	type: (type: 'sent' | 'received') => [...friendRequestQueryKeys.all, type] as const,
};

export const friendshipQueryKeys = {
	all: ['friendship'] as const,
};

export const postQueryKeys = {
	all: () => ['posts'] as const,
	user: (userId: string) => [...postQueryKeys.all(), 'user', userId] as const,
	community: (communityId: string) => [...postQueryKeys.all(), 'community', communityId] as const,
	current: (postId: string) => [...postQueryKeys.all(), postId] as const,
	liked: (postId: string) => [...postQueryKeys.all(), 'liked', postId] as const,
	disliked: (postId: string) => [...postQueryKeys.all(), 'disliked', postId] as const,
	comments: (postId: string) => [...postQueryKeys.all(), 'comments', postId] as const,
	editing: (postId: string) => [...postQueryKeys.all(), 'editing', postId] as const,
	deleting: (postId: string) => [...postQueryKeys.all(), 'deleting', postId] as const,
};

export const userQueryKeys = {
	current: ['user', 'current'] as const,
	user: (userId: string) => ['user', userId] as const,
};
