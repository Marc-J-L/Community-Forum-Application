import { Add as AddIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
	Alert,
	Avatar,
	CircularProgress,
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { useAuth } from '../contexts';
import { useGetUserCommunities, useToggleOpenEl } from '../hooks';
import { CommunityInputFormDialog } from './CommunityInputFormDialog';
import { UserCommunityItem } from './UserCommunityItem';

interface PropsI {
	title: string;
	endingDivider?: boolean;
	children: React.ReactNode;
}

function ListCollapse({ title, endingDivider = true, children }: PropsI) {
	const { isOpen, toggleEl } = useToggleOpenEl(true);

	return (
		<List disablePadding>
			<Divider />

			<ListItem disablePadding sx={{ backgroundColor: grey[200] }}>
				<ListItemButton onClick={toggleEl} sx={{ height: '56px' }}>
					<ListItemText primary={title} />
					{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItemButton>
			</ListItem>

			<Collapse in={isOpen} unmountOnExit>
				<List>{children}</List>
			</Collapse>

			{endingDivider && <Divider />}
		</List>
	);
}

export function UserCommunityList() {
	const { accessToken } = useAuth();
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();

	const { data, isLoading, isError } = useGetUserCommunities(accessToken as string, 'all');

	const renderList = (isCreator: boolean = false) => {
		if (isLoading)
			return (
				<ListItem sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
					<CircularProgress size={25} />
				</ListItem>
			);

		if (isError) return <Alert severity='error'>An error occurred.</Alert>;

		const itemsToRender = isCreator
			? data?.filter(community => community.isCreator)
			: data?.filter(community => !community.isCreator);

		if (itemsToRender?.length === 0)
			return (
				<ListItem sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
					<Typography color='textSecondary'>No communities.</Typography>
				</ListItem>
			);

		return itemsToRender?.map((community, index) => <UserCommunityItem key={index} community={community} />);
	};

	return (
		<>
			<ListCollapse title='My Communities' endingDivider={false}>
				<ListItem disablePadding>
					<ListItemButton onClick={openEl}>
						<ListItemIcon>
							<Avatar>
								<AddIcon />
							</Avatar>
						</ListItemIcon>
						<ListItemText primary='Create a community' />
					</ListItemButton>
				</ListItem>
				<CommunityInputFormDialog isOpen={isOpen} isMobile={isMobile} closeEl={closeEl} />

				{renderList(true)}
			</ListCollapse>

			<ListCollapse title='Joined Communities'>{renderList()}</ListCollapse>
		</>
	);
}
