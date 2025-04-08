import { z } from 'zod';

export const CommunityUpdateSchema = z.object({
	description: z
		.string()
		.min(1, { message: 'Description is required' })
		.max(500, { message: 'Description is too long' }),
	visibility: z.enum(['Public', 'Private']).default('Public'),
});

export const CommunityCreateSchema = CommunityUpdateSchema.extend({
	name: z
		.string()
		.min(3, { message: 'Community name must be at least 3 characters' })
		.max(20, { message: 'Community name cannot exceed 20 characters' }),
});
