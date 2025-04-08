import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { sendRequest } from '../../api';
import { useAuth } from '../../contexts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { REPORT_ENDPOINT } from '../../api/endpoints';

export interface Comment {
    id: string;                
    postId: string;           
    userId: string;           
    content: string;          
    createdAt: string;     
    updatedAt?: string;    
}

interface CommentWithEmail {
    comment: Comment;
    userEmail: string;
}

interface Report {
    createdAt: string; 
    entityId: string;
    id: string
    reason: string;
    reportType: string;
    reporterId: string;
    comment?: CommentWithEmail;
}

const Reports: React.FC = () => {
    const navigate = useNavigate();

    const { accessToken } = useAuth();

    const [ reports, setReports ] = useState<Report[]>([]);

    async function fetchReports() {
        try {
            const response = await sendRequest({
                endpoint: `${REPORT_ENDPOINT}/all`,
                method: "GET",
                accessToken: accessToken as string
            }); 
    
            const data = await response.data;
    
            setReports(data);
            console.log(data)
        } catch {
            enqueueSnackbar('Failed to fetch reports', { variant: 'error' });
        }

    }

    async function resolveReport(id:string) {
        try {
            await sendRequest({
                endpoint: `${REPORT_ENDPOINT}/${id}`,
                method: "DELETE",
                accessToken: accessToken as string
            });

            const newReports = reports.filter(r => r.id != id);

            setReports(newReports);

            enqueueSnackbar('Report resolved ', { variant: 'success' });
            
   
        } catch {
            enqueueSnackbar('Failed to resolve report', { variant: 'error' });
        }

    }

    function capitalize(str: string) {
        if (!str) return ''; // Return empty string if input is falsy
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatTimestamp(timestamp: string) {
        return timestamp.split('T')[0];
    }
    

    useEffect(() => {
        fetchReports();
        
    }, [])
  
  return (
    <Box mt="1rem" > 
        <Typography variant="h6" mb="1rem">
            Reports
        </Typography>

        <Box
            display="flex"
            flexDirection="column"
            gap="1rem"
        >
            {reports && reports.length < 1 && <Typography>No Reports Found</Typography>}

            {reports && reports.length >= 1 && reports.map( r => (
                <Box 
                    key={r.id}
                    sx={{ borderBottom: 1 , borderColor: 'primary.main'}}
                    py="1rem"
                >
                    <Typography
                        fontWeight="bold"
                    >{capitalize(r.reason)}</Typography>

                    <Typography>{capitalize(r.reportType)} Report</Typography>

                    {r.reportType === "comment" &&  <Typography>Comment: {r.comment?.comment.content}</Typography>}
                    {r.reportType === "comment" &&  <Typography>Commenter: {r.comment?.userEmail}</Typography>}

                    <Typography
                        mb="1rem"
                    >Report Date: {formatTimestamp(r.createdAt)}</Typography>

                    
                    { r.reportType === "post" && 
                        <Box
                            display="flex"
                            gap=".5rem"
                        >
                            <Button
                                onClick={() => navigate("/posts/" + r.entityId)}
                                variant='outlined'
                            >
                                View {r.reportType}
                            </Button>

                            <Button 
                                variant='outlined'
                                color='error'
                                onClick={() => resolveReport(r.id)}
                            >Resolve</Button>
                        </Box>

                    }

                    {r.reportType === "comment" && 
                        <Box
                            display="flex"
                            gap=".5rem"
                        >
                            <Button
                                onClick={() => navigate("/posts/" + r.comment?.comment.postId)}
                                variant='outlined'
                            >
                                View Post
                            </Button>

                            <Button 
                                variant='outlined'
                                color='error'
                                onClick={() => resolveReport(r.id)}
                            >Resolve</Button>
                        </Box>
                    }

                    { r.reportType === "community" && 
                        <Box
                            display="flex"
                            gap=".5rem"
                        >
                            <Button
                                onClick={() => navigate("/community/" + r.entityId)}
                                variant='outlined'
                            >
                                View {r.reportType}
                            </Button>

                            <Button 
                                variant='outlined'
                                color='error'
                                onClick={() => resolveReport(r.id)}
                            >Resolve</Button>
                        </Box>

                    }



                </Box>

            ))}

        </Box>
    </Box>

  );
};

export default Reports;
