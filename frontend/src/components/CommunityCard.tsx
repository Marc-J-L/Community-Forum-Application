import { Cake, Edit, Lock, PeopleAlt, Public } from '@mui/icons-material';
import { Card, CardContent, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useToggleOpenEl, useUserCommunityRelationship } from '../hooks';
import { CommunityT } from '../types';
import { JoinCommunityBtn, LeaveCommunityBtn, UserCommunityStarBtn } from './common';
import { ReportBtn } from './common/ReportBtn';
import { CommunityInputFormDialog } from './CommunityInputFormDialog';

interface PropsI {
	community: CommunityT;
}

export function CommunityCard({ community }: PropsI) {
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();
	const { id, name, userCount, description, createdAt, visibility } = community;
	const { isJoined, isCreator } = useUserCommunityRelationship(id);

	return (
		<Card
			sx={{
				p: 1,
				backgroundColor: '#f0f4f8',
				position: 'relative',
			}}>
			<CardContent>
				<Stack
					direction='row'
					gap={1}
					sx={{
						float: 'right',
					}}>
					{!isCreator && <ReportBtn type='community' id={id} />}
					{isJoined && <UserCommunityStarBtn community={isJoined} />}
				</Stack>

				<Stack gap={1}>
					<Stack direction='row' gap={2} alignItems='baseline'>
						<Typography
							variant='h4'
							component='div'
							sx={{
								color: '#3f51b5',
								fontWeight: 'bold',
								wordWrap: 'break-word',
								wordBreak: 'break-all',
							}}>
							{name}
						</Typography>
						{isCreator ? (
							<>
								<Tooltip title='Edit Community'>
									<IconButton onClick={openEl}>
										<Edit />
									</IconButton>
								</Tooltip>
								<CommunityInputFormDialog
									isOpen={isOpen}
									isMobile={isMobile}
									closeEl={closeEl}
									formData={community}
								/>
							</>
						) : isJoined ? (
							<LeaveCommunityBtn community={community} />
						) : (
							<JoinCommunityBtn community={community} isJoined={!!isJoined} />
						)}
					</Stack>
					<Typography variant='h6'>{description}</Typography>

					<Stack direction='row' gap={2} sx={{ color: 'text.secondary' }}>
						<Cake />
						<Typography>Created {dayjs(createdAt).format('MM/DD/YYYY')}</Typography>
					</Stack>

					<Stack direction='row' gap={2} sx={{ color: 'text.secondary' }}>
						<PeopleAlt />
						<Typography>
							{userCount} {userCount > 1 ? 'members' : 'member'}
						</Typography>
					</Stack>

					<Stack direction='row' gap={2} sx={{ color: 'text.secondary' }}>
						{visibility === 'Public' ? <Public /> : <Lock />}
						<Typography>{visibility}</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}
