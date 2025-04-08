import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const AccountSuspended: React.FC = () => {
  return (
    <Box 
      textAlign="center" 
      p={5} 
      sx={{
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Your Account is Suspended
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '20px', fontSize: '18px' }}>
        Your account has been suspended due to violations of our policies. 
        If you believe this is an error, please contact the manager or admin for assistance.
      </Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        sx={{ backgroundColor: '#c82333', color: '#fff', '&:hover': { backgroundColor: '#a71d2a' } }}
        href="mailto:support@ourforum.com"
      >
        Contact Support
      </Button>
    </Box>
  );
};

export default AccountSuspended;
