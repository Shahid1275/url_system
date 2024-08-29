
import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box, Paper, Alert, Card, CardContent, CardActions, Tooltip, Divider } from '@mui/material';
import KeyIcon from '@mui/icons-material/VpnKey';
import DeleteIcon from '@mui/icons-material/Delete';
import './ApiKey.css';

function ApiKey() {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const cachedApiKey = localStorage.getItem('apiKey');

    if (cachedApiKey) {
      setApiKey(cachedApiKey);
    } else {
      const checkExistingApiKey = async () => {
        setError(null);
        try {
          const response = await fetch('http://localhost:3000/api/api-key', {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error);
          }

          const data = await response.json();
          if (data.apiKey) {
            setApiKey(data.apiKey.api_key);
            localStorage.setItem('apiKey', data.apiKey.api_key);
          }
        } catch (err) {
          setError(err.message);
        }
      };

      checkExistingApiKey();
    }
  }, []);

  const handleApiKey = async (action) => {
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`http://localhost:3000/api/api-key/${action}`, {
        method: action === 'generate' ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': action === 'generate' ? 'application/json' : undefined,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error);
      }

      if (action === 'generate') {
        const data = await response.json();
        setApiKey(data.apiKey.api_key);
        localStorage.setItem('apiKey', data.apiKey.api_key);
        setSuccessMessage('Your API key has been generated successfully!');
      } else if (action === 'delete') {
        setApiKey(null);
        localStorage.removeItem('apiKey');
        setSuccessMessage('Your API key has been deleted successfully!');
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setError(err.message);

      // Handle the specific error message and set a timeout for 2 seconds
      if (err.message === "API Key already exists for this user") {
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 5, p: 3, backgroundColor: '#fafafa', borderRadius: '12px' }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            Manage Your API Key
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Generate or delete your personal API key to authenticate your requests securely.
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Box display="flex" justifyContent="center" gap={3}>
            <Tooltip title="Generate a new API Key" arrow>
              <Button 
                variant="contained" 
                startIcon={<KeyIcon />} 
                onClick={() => handleApiKey('generate')} 
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                  fontWeight: 'bold'
                }}
              >
                Generate API Key
              </Button>
            </Tooltip>
            <Tooltip title="Delete existing API Key" arrow>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />} 
                onClick={() => handleApiKey('delete')}
                sx={{ fontWeight: 'bold' }}
              >
                Delete API Key
              </Button>
            </Tooltip>
          </Box>
          
          <Box mt={4}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
          </Box>

          {apiKey && (
            <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: '12px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Your API Key:
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '1.25rem' }}>
                {apiKey}
              </Typography>
            </Paper>
          )}
        </CardContent>

        <CardActions>
          <Typography align="center" variant="body2" sx={{ width: '100%', mt: 4, color: 'text.secondary' }}>
            Make sure to store your API key securely and avoid sharing it with unauthorized parties.
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
}

export default ApiKey;
