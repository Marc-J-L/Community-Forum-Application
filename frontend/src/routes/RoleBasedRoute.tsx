// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../contexts';
// import { Role } from '../types';

// interface PropsI {
// 	allowedRoles: Role[];
// }

// export function RoleBasedRoute({ allowedRoles }: PropsI) {
// 	const { user } = useAuth();

// 	if (user && allowedRoles.includes(Role.Guest) && allowedRoles.length === 1) {
// 		return <Navigate to='/' replace />;
// 	}

// 	if (user && !allowedRoles.includes(user.role as Role)) {
// 		return <Navigate to='/unauthorized' replace />;
// 	}

// 	if (!user && !allowedRoles.includes(Role.Guest)) {
// 		return <Navigate to='/login' replace />;
// 	}

// 	return <Outlet />;
// }

import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '../components';
import { useAuth } from '../contexts';
import { Role } from '../types';

interface PropsI {
	allowedRoles: Role[];
}

export function RoleBasedRoute({ allowedRoles }: PropsI) {
	const { user, isAuthLoading, setIsAuthLoading } = useAuth();

	if (isAuthLoading && !allowedRoles.includes(Role.Guest)) return <Loading />;

	if (isAuthLoading && allowedRoles.includes(Role.Guest)) setIsAuthLoading(false);

	// Redirect to 'account-suspended' if the user's role is 'Suspended'
	if (user && user.role === Role.Suspended) {
		return <Navigate to='/account-suspended' replace />;
	}

	// Check if the user's role is allowed for the current route
	if (user && !allowedRoles.includes(user.role as Role)) {
		return <Navigate to='/access-denied' replace />;
	}

	// If the user is not authenticated and the route is not accessible to guests, redirect to login
	if (!user && !allowedRoles.includes(Role.Guest)) {
		return <Navigate to='/login' replace />;
	}

	// Render the child routes if the user is allowed
	return <Outlet />;
}
