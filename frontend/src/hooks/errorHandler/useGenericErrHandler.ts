import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export const useGenericErrHandler = () => {
	const navigate = useNavigate();

	return (err: AxiosError) => {
		if (err.message === 'Network Error') {
			if (!navigator.onLine) {
				enqueueSnackbar('You appear to be offline. Please check your internet connection', {
					variant: 'error',
				});
			} else {
				navigate('/server-error');
			}
			return;
		}

		switch (err.status) {
			case 401:
				navigate('/login');
				break;
			case 403:
				navigate('/access-denied');
				break;
			case 404:
				navigate('/not-found');
				break;
			case 500:
				enqueueSnackbar('Something went wrong on our end, please try again later', { variant: 'error' });
				break;
		}
	};
};
