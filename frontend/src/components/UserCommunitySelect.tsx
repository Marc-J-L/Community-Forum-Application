import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import { userCommunityQueryKeys } from '../consts';
import { UserCommunityT } from '../types';


interface PropsI {
	setCommunityId: React.Dispatch<React.SetStateAction<string>>;
	communityId: string;
}
export function UserCommunitySelect({ setCommunityId, communityId }: PropsI) {
	const { data: joinedCommunities } = useQuery<UserCommunityT[]>({ queryKey: userCommunityQueryKeys.all });

	const handleChange = (event: SelectChangeEvent) => {
		setCommunityId(event.target.value as string);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id='user-community-select-label'>Community</InputLabel>
			<Select
				labelId='user-community-select-label'
				id='user-community-select'
				value={communityId}
				label='Community'
				onChange={handleChange}>
				{joinedCommunities?.map(community => (
					<MenuItem key={community.id} value={community.id}>
						{community.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
