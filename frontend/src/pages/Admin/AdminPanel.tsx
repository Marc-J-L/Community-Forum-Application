// import React, { useState } from 'react';
// import { Box, Typography, Button, List, ListItem, ListItemText, Snackbar, Alert, TextField } from '@mui/material';
// import { useFetchUsers } from '../../hooks/apiHooks/Admin/useFetchUsers';
// import { useUpdateUserRole } from '../../hooks/apiHooks/Admin/useUpdateUserRole';
// import { useFetchPostsByDate } from '../../hooks/apiHooks/Admin/useFetchPostsByDate';
// import { UserInfoDTO } from '../../types/user.type';
// import { getAuth } from 'firebase/auth'; // Import Firebase auth to get current user
// import dayjs from 'dayjs';

// const AdminPanel: React.FC = () => {
//   const { data: users, isLoading: usersLoading, isError: usersError } = useFetchUsers();
//   const { mutate: updateUserRole } = useUpdateUserRole();
//   const [flashMessage, setFlashMessage] = useState<string | null>(null); // State for flash messages
//   const [flashSeverity, setFlashSeverity] = useState<'success' | 'error'>('success'); // State for flash message severity
//   const auth = getAuth();
//   const currentUserUid = auth.currentUser?.uid; // Get the current logged-in user ID

//   const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); // State for selected date
//   const { data: posts, isLoading: postsLoading, isError: postsError } = useFetchPostsByDate(selectedDate); // Fetch posts by selected date

//   const handlePromote = (uid: string) => {
//     updateUserRole({ uid, role: 'Admin' }, {
//       onSuccess: () => {
//         setFlashMessage('User has been successfully promoted to Admin.');
//         setFlashSeverity('success');
//       },
//       onError: () => {
//         setFlashMessage('Failed to promote user to Admin.');
//         setFlashSeverity('error');
//       }
//     });
//   };

//   const handleSuspend = (uid: string) => {
//     updateUserRole({ uid, role: 'Suspended' }, {
//       onSuccess: () => {
//         setFlashMessage('User has been successfully suspended.');
//         setFlashSeverity('success');
//       },
//       onError: () => {
//         setFlashMessage('Failed to suspend user.');
//         setFlashSeverity('error');
//       }
//     });
//   };

//   const handleDemote = (uid: string) => {
//     updateUserRole({ uid, role: 'User' }, {
//       onSuccess: () => {
//         setFlashMessage('Admin has been successfully demoted to regular user.');
//         setFlashSeverity('success');
//       },
//       onError: () => {
//         setFlashMessage('Failed to demote Admin.');
//         setFlashSeverity('error');
//       }
//     });
//   };

//   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDate(event.target.value); // Update the selected date
//   };

//   if (usersLoading) {
//     return <Typography variant="h6">Loading users...</Typography>;
//   }

//   if (usersError || !users) {
//     return <Typography variant="h6" color="error">Failed to load users</Typography>;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Admin Panel
//       </Typography>

//       {/* Display number of users */}
//       <Typography variant="h6" gutterBottom>
//         Total Users: {users.length}
//       </Typography>

//       <List>
//         {users.map((user: UserInfoDTO) => (
//           <ListItem key={user.id} style={{ backgroundColor: user.role === 'Admin' ? '#f0f0f0' : '#fff' }}>
//             <ListItemText
//               primary={`${user.firstName || 'First Name'} ${user.lastName || 'Last Name'}`}
//               secondary={currentUserUid === user.id ? "This is you!" : `Role: ${user.role || 'User'}`}
//             />
            
//             {currentUserUid !== user.id && user.role !== 'Admin' && (
//               <Button variant="outlined" onClick={() => handlePromote(user.id)} style={{ marginRight: '10px' }}>
//                 Promote to Admin
//               </Button>
//             )}
//             {currentUserUid !== user.id && user.role !== 'Suspended' && (
//               <Button variant="outlined" color="error" onClick={() => handleSuspend(user.id)} style={{ marginRight: '10px' }}>
//                 Suspend User
//               </Button>
//             )}
//             {user.role === 'Admin' && currentUserUid !== user.id && (
//               <Button variant="outlined" color="primary" onClick={() => handleDemote(user.id)} style={{ marginRight: '10px' }}>
//                 Demote to User
//               </Button>
//             )}
//           </ListItem>
//         ))}
//       </List>

//       {/* Flash messages */}
//       <Snackbar open={!!flashMessage} autoHideDuration={6000} onClose={() => setFlashMessage(null)}>
//         <Alert onClose={() => setFlashMessage(null)} severity={flashSeverity} sx={{ width: '100%' }}>
//           {flashMessage}
//         </Alert>
//       </Snackbar>

//       {/* Date Picker and Post Count */}
//       <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
//         View Posts by Date
//       </Typography>
//       <TextField
//         label="Select Date"
//         type="date"
//         value={selectedDate}
//         onChange={handleDateChange}
//         InputLabelProps={{
//           shrink: true,
//         }}
//         style={{ marginBottom: '20px' }}
//       />

//       {postsLoading && <Typography variant="h6">Loading post count...</Typography>}
//       {postsError && <Typography variant="h6" color="error">Failed to load post count</Typography>}

//       {/* Display only the number of posts */}
//       {posts && (
//         <Typography variant="h6">
//           {posts.length} posts were created on {selectedDate}.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default AdminPanel;

import React from 'react';
import { Box, Typography } from '@mui/material';

import PostCountByDate from '../../components/Admin/PostCountByDate';
import UserManagement from '../../components/Admin/UserManagement';
import TotalUsers from '../../components/Admin/TotalUsers';
import Reports from '../../components/Admin/Reports';
import PostCountLastFiveDays from '../../components/Admin/PostCountLastFiveDays';

const AdminPanel: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Total Users Component */}
      <TotalUsers />

      {/* User Management Component */}
      <UserManagement />

      {/* Post Count By Date Component */}
      <PostCountByDate />

      {/* Post Statistic */}
      <PostCountLastFiveDays />

      {/* Report handler */}
      <Reports />
    </Box>
  );
};

export default AdminPanel;

