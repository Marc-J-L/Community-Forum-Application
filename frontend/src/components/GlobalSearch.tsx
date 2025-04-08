import { Search as SearchIcon } from '@mui/icons-material';
import { Drawer, IconButton, InputBase, Stack, Toolbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToggleOpenEl } from '../hooks';

const Search = styled('form')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	flexGrow: 1,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		margin: theme.spacing(1, 2),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	width: '100%',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	},
}));

export function GlobalSearch() {
	const navigate = useNavigate();
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();
	const [searchParams, _setSearchParams] = useSearchParams();
	const q = useMemo(() => searchParams.get('q') ?? '', [searchParams]);
	const tab = useMemo(() => searchParams.get('tab') ?? '', [searchParams]);

	const [query, setQuery] = useState(q);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		navigate(`/search?q=${query}&tab=${tab || 'posts'}`);
	};

	useEffect(() => {
		if (!location.pathname.startsWith('/search')) setQuery('');
	}, [location.pathname]);

	const searchBar = (
		<Search onSubmit={onSubmit}>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder='Search for communities, posts, users...'
				inputProps={{ 'aria-label': 'search' }}
				name='q'
				value={query}
				onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
			/>
		</Search>
	);

	return isMobile ? (
		<>
			<IconButton size='large' color='inherit' onClick={openEl}>
				<SearchIcon />
			</IconButton>

			<Drawer anchor='top' open={isOpen} onClose={closeEl}>
				<Toolbar />
				<Stack mt={2} mb={1}>
					{searchBar}
				</Stack>
			</Drawer>
		</>
	) : (
		searchBar
	);
}
