import { Toolbar } from '@mui/material';
import dayjs from 'dayjs';

export function Footer() {
	return (
		<Toolbar
			sx={{
				bgcolor: 'lightgray',
				color: 'text.secondary',
				justifyContent: 'center',
			}}>
			&copy; Copyright {dayjs().year()} OurForum
		</Toolbar>
	);
}
