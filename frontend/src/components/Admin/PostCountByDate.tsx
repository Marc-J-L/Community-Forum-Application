import React, { useState } from 'react';
import { Typography, TextField } from '@mui/material';
import { useFetchPostsByDate } from '../../hooks/apiHooks/Admin/useFetchPostsByDate';
import dayjs from 'dayjs';

const PostCountByDate: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); // State for selected date
  const { data: posts, isLoading, isError } = useFetchPostsByDate(selectedDate); // Fetch posts by selected date

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value); // Update the selected date
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        View Posts by Date
      </Typography>
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: '20px' }}
      />

      {isLoading && <Typography variant="h6">Loading post count...</Typography>}
      {isError && <Typography variant="h6" color="error">Failed to load post count</Typography>}

      {posts && (
        <Typography variant="h6">
          {posts.length} posts were created on {selectedDate}.
        </Typography>
      )}
    </div>
  );
};

export default PostCountByDate;
