import { useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

export const useToggleOpenEl = (defaultOpen: boolean = false) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const openEl = () => {
		setIsOpen(true);
	};

	const closeEl = () => {
		setIsOpen(false);
	};

	const toggleEl = () => {
		setIsOpen(!isOpen);
	};

	return { isOpen, isMobile, openEl, closeEl, toggleEl };
};
