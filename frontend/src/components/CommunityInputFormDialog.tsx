import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { communityQueryKeys, INITIAL_COMMUNITY_CREATE_REQ_OBJ, userCommunityQueryKeys } from '../consts';
import { useAuth } from '../contexts';
import { useCreateCommunity, useUpdateCommunity } from '../hooks';
import { CommunityCreateSchema } from '../schemas';
import { CommunityCreateDTO, CommunityT, CommunityUpdateDTO } from '../types';
import { RHFSelect, RHFTextField } from './common';

const visibilityOptions = [
	{ label: 'Public', value: 'Public' },
	{ label: 'Private', value: 'Private' },
];

interface PropsI {
	isOpen: boolean;
	isMobile: boolean;
	closeEl: () => void;
	formData?: CommunityT;
}

type CommunityFormDTO<T extends boolean> = T extends true ? CommunityUpdateDTO : CommunityCreateDTO;

export function CommunityInputFormDialog({ isOpen, isMobile, closeEl, formData }: PropsI) {
	const queryClient = useQueryClient();
	const isUpdate = useMemo(() => !!formData, [formData]);
	const communityId = useMemo(() => formData?.id, [formData]);
	const defaultValues = useMemo(
		() =>
			formData
				? { name: formData.name, description: formData.description, visibility: formData.visibility }
				: INITIAL_COMMUNITY_CREATE_REQ_OBJ,
		[formData]
	);

	const { accessToken } = useAuth();
	const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity(accessToken as string);
	const { mutate: updateCommunity, isPending: isUpdating } = useUpdateCommunity(
		accessToken as string,
		communityId as string
	);

	const methods = useForm<CommunityFormDTO<typeof isUpdate>>({
		resolver: zodResolver(CommunityCreateSchema),
		defaultValues,
	});
	const {
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = methods;

	const handleDialogClose = () => {
		closeEl();
		reset();
	};

	const onSubmit: SubmitHandler<CommunityFormDTO<typeof isUpdate>> = data => {
		if (isUpdate) {
			updateCommunity(data as CommunityUpdateDTO, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: userCommunityQueryKeys.all });
					queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });

					enqueueSnackbar('Community updated successfully', { variant: 'success' });
					handleDialogClose();
				},
				onError: () => setError('root', { message: 'An error occurred.' }),
			});
		} else {
			createCommunity(data as CommunityCreateDTO, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: userCommunityQueryKeys.all });
					enqueueSnackbar('Community created successfully', { variant: 'success' });
					handleDialogClose();
				},
				onError: err => {
					const { status } = err as AxiosError;
					if (status === 409) {
						setError('name', { message: 'This community name has already been taken' });
						return;
					}

					setError('root', { message: 'An error occurred.' });
				},
			});
		}
	};

	return (
		<FormProvider {...methods}>
			<Dialog
				fullWidth
				open={isOpen}
				fullScreen={isMobile}
				onClose={handleDialogClose}
				PaperProps={{
					component: 'form',
					noValidate: true,
					onSubmit: handleSubmit(onSubmit),
				}}>
				<DialogTitle>{isUpdate ? 'Edit your community' : 'Tell us about your community'}</DialogTitle>
				<DialogContent>
					<Stack gap={3} py={1}>
						{errors.root && <Alert severity='error'>{errors.root.message}</Alert>}

						{!isUpdate && (
							<DialogContentText>
								A name and description help people understand what your community is about
							</DialogContentText>
						)}

						<RHFTextField<CommunityFormDTO<typeof isUpdate>>
							name='name'
							label='Community name'
							required={!isUpdate}
							disabled={isUpdate}
						/>

						<RHFTextField<CommunityFormDTO<typeof isUpdate>>
							name='description'
							label='Description'
							required
							multiline
							rows={7}
						/>

						<RHFSelect<CommunityFormDTO<typeof isUpdate>>
							name='visibility'
							label='Visibility'
							options={visibilityOptions}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<LoadingButton type='submit' loading={isCreating || isUpdating}>
						{isUpdate ? 'Save' : 'Create'}
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</FormProvider>
	);
}
