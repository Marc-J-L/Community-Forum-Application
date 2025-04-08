import React from 'react';
import { Typography } from '@mui/material';
import { useFetchUsers } from '../../hooks/apiHooks/Admin/useFetchUsers';

const TotalUsers: React.FC = () => {
  const { data: users, isLoading, isError } = useFetchUsers();

  if (isLoading) {
    return <Typography variant="h6">Loading user count...</Typography>;
  }

  if (isError || !users) {
    return <Typography variant="h6" color="error">Failed to load user count</Typography>;
  }

  return (
    <Typography variant="h6">
      Total Users: {users.length}
    </Typography>
  );
};

export default TotalUsers;
