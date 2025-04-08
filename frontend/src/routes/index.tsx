// import { Navigate, Route, Routes } from 'react-router-dom';
// import { GenericInfo } from '../components';
// import { MainLayout } from '../layouts';

// import { AdminPanel,Community, EditProfile, Friends, Home, Login, PostDetail, Profile, Register, Search } from '../pages';

// import { Role } from '../types';
// import { RoleBasedRoute } from './RoleBasedRoute';

// function AppRoutes() {
// 	return (
// 		<Routes>
// 			<Route path='/' element={<MainLayout />}>
// 				<Route index element={<Home />} />
// 				<Route path='/community/:communityId' element={<Community />} />

// 				<Route path='/search' element={<Search />} />
// 				<Route path='/friends' element={<Friends />} />
// 				{/* Protected Route for Profile */}
// 				{/* <Route element={<RoleBasedRoute allowedRoles={[Role.User, Role.Admin]} />}>
// 					<Route path="/profile" element={<Profile />} />
// 				</Route> */}
// 				{/* Protected Route for Admins */}
// 				<Route element={<RoleBasedRoute allowedRoles={[Role.Admin]} />}>
// 					<Route path="/admin" element={<AdminPanel />} />
// 				</Route>
// 				{/* <Route path="/admin" element={<AdminPanel />} /> */}
// 				<Route path='/profile' element={<Profile />} />

// 				<Route path='/posts/:postId' element={<PostDetail />} />

// 				<Route path='/profile/editprofile' element={<EditProfile />} />

// 				<Route
// 					path='access-denied'
// 					element={
// 						<GenericInfo
// 							msgType='warning'
// 							title='Access denied'
// 							msg='You do not have permission to view this page.'
// 							autoRedirect={true}
// 						/>
// 					}
// 				/>

// 				<Route
// 					path='server-error'
// 					element={
// 						<GenericInfo
// 							msgType='error'
// 							title='An error occurred'
// 							msg='The server encountered an error while processing your request. Please try again later.'
// 						/>
// 					}
// 				/>

// 				<Route
// 					path='not-found'
// 					element={
// 						<GenericInfo
// 							msgType='info'
// 							title='Not found'
// 							msg='The resource you are looking for is not found.'
// 							autoRedirect={true}
// 						/>
// 					}
// 				/>
// 			</Route>

// 			<Route element={<RoleBasedRoute allowedRoles={[Role.Guest]} />}>
// 				<Route path='login' element={<Login />} />
// 				<Route path='register' element={<Register />} />
// 			</Route>

// 			<Route path='*' element={<Navigate to='/not-found' replace />} />
// 		</Routes>
// 	);
// }

// export default AppRoutes;

import { Navigate, Route, Routes } from 'react-router-dom';
import { GenericInfo } from '../components';
import { MainLayout } from '../layouts';
import {
	AccountSuspended,
	AdminPanel,
	Community,
	EditProfile,
	Friends,
	Home,
	Login,
	PostDetail,
	ProfilePage,
	Register,
	Search,
} from '../pages'; // Import AccountSuspended
import { AllPosts } from '../pages/Post/AllPosts';
import { MyPosts } from '../pages/Post/MyPosts';
import { Role } from '../types';
import { RoleBasedRoute } from './RoleBasedRoute';

import ReportingTest from '../pages/ReportingTest';

function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route index element={<AllPosts />} />

				{/* Protect Home, Friends, and All Posts */}
				<Route element={<RoleBasedRoute allowedRoles={[Role.User, Role.Admin]} />}>
					<Route path='/feed' element={<Home />} />
					<Route path='/friends' element={<Friends />} />
					<Route path='/posts/me' element={<MyPosts />} />
					<Route path='/posts/:postId' element={<PostDetail />} />
					<Route path='/search' element={<Search />} /> {/* Added Search Route */}
					<Route path='/community/:communityId' element={<Community />} /> {/* Added Community Route */}
				</Route>

				{/* Protected Route for Profile (Accessible by User and Admin) */}
				<Route element={<RoleBasedRoute allowedRoles={[Role.User, Role.Admin]} />}>
					{/* <Route path="/profile" element={<Profile />} /> */}
					<Route path='/profile' element={<ProfilePage />} />
					<Route path='/profile/:id' element={<ProfilePage />} />
					<Route path='/profile/editprofile' element={<EditProfile />} />
				</Route>

				{/* Protected Route for Admins (Accessible by Admin only) */}
				<Route element={<RoleBasedRoute allowedRoles={[Role.Admin]} />}>
					<Route path='/admin' element={<AdminPanel />} />
				</Route>

				{/* Account Suspended Page */}
				<Route path='/account-suspended' element={<AccountSuspended />} />

				{/* report test */}
				<Route path='/report' element={<ReportingTest />} />

				{/* Error Pages */}
				<Route
					path='access-denied'
					element={
						<GenericInfo
							msgType='warning'
							title='Access denied'
							msg='You do not have permission to view this page.'
							autoRedirect={true}
						/>
					}
				/>
				<Route
					path='server-error'
					element={
						<GenericInfo
							msgType='error'
							title='An error occurred'
							msg='The server encountered an error while processing your request. Please try again later.'
						/>
					}
				/>
				<Route
					path='not-found'
					element={
						<GenericInfo
							msgType='info'
							title='Not found'
							msg='The resource you are looking for is not found.'
							autoRedirect={true}
						/>
					}
				/>
			</Route>

			{/* Guest Only Routes */}
			<Route element={<RoleBasedRoute allowedRoles={[Role.Guest]} />}>
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
			</Route>

			{/* Redirect any other routes to Not Found */}
			<Route path='*' element={<Navigate to='/not-found' replace />} />
		</Routes>
	);
}

export default AppRoutes;
