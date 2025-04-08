import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';

type Props<T extends FieldValues> = {
	name: Path<T>;
	options: {
		value: string | number;
		label: string;
	}[];
} & SelectProps;

export function RHFSelect<T extends FieldValues>({ name, options, label, ...props }: Props<T>) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<FormControl fullWidth>
					<InputLabel>{label}</InputLabel>
					<Select label={label} {...field} {...props} displayEmpty={!label} error={!!error}>
						{options.map(({ value, label }) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>{error?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
}
