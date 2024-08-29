

import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, Select, MenuItem, Typography, Box, Snackbar, Alert, Paper } from '@mui/material';
import QRCode from 'qrcode.react';
import { FaEdit, FaTrash, FaClipboard } from 'react-icons/fa';

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlType, setUrlType] = useState('misc');
  const [urlTag, setUrlTag] = useState(1);
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/urls', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          }
        });
        const data = await response.json();
        setUrls(data);
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
      }
    };

    fetchUrls();
  }, []);

  const handleEditUrl = (urlId) => {
    const urlToEdit = urls.find((url) => url.url_id === urlId);
    if (urlToEdit) {
      setEditingUrlId(urlId);
      setOriginalUrl(urlToEdit.original_url);
      setShortUrl(urlToEdit.short_url);
      setUrlType(urlToEdit.url_type);
      setUrlTag(urlToEdit.tag_id || 1);
      setShowModal(true);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    try {
      await fetch(`http://localhost:3000/api/urls/${urlId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'DELETE',
      });
      setUrls(urls.filter((url) => url.url_id !== urlId));
      setSnackbarMessage('Deleted URL successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to delete URL:', error);
    }
  };

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setSnackbarMessage('Copied URL!');
    setSnackbarOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOriginalUrl('');
    setShortUrl('');
    setUrlType('misc');
    setUrlTag(1);
    setEditingUrlId(null);
  };

  const handleSaveChanges = async () => {
    if (editingUrlId) {
      try {
        await fetch(`http://localhost:3000/api/urls/${editingUrlId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            original_url: originalUrl,
            short_url: shortUrl,
            url_type: urlType,
            tag_id: urlTag,
          }),
        });
        setUrls(urls.map((url) =>
          url.url_id === editingUrlId
            ? { ...url, original_url: originalUrl, short_url: shortUrl, url_type: urlType, tag_id: urlTag }
            : url
        ));
        handleCloseModal();
        setSnackbarMessage('Updated URL successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to update URL:', error);
      }
    }
  };

  const handleFilterChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const filteredUrls = urls.filter(
    (url) => !selectedTag || url.tag_id === parseInt(selectedTag)
  );

  const getTagNameById = (tagId) => {
    switch (tagId) {
      case 1:
        return 'Simple';
      case 17:
        return 'Product';
      case 18:
        return 'New';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        My URLs
      </Typography>

      <Select
        value={selectedTag}
        onChange={handleFilterChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Filter by Tag' }}
        sx={{ mb: 2, width: 200, backgroundColor: 'blue', color: 'white' }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="1">Simple</MenuItem>
        <MenuItem value="17">Product</MenuItem>
        <MenuItem value="18">New</MenuItem>
      </Select>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUrls.map((url, index) => (
              <TableRow key={url.url_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{url.original_url}</TableCell>
                <TableCell>
                  <a
                    href={`http://localhost:3000/api/urls/redirect/${url.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.short_url}
                  </a>
                </TableCell>
                <TableCell>{url.url_type}</TableCell>
                <TableCell>{getTagNameById(url.tag_id)}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleCopyToClipboard(url.short_url)}
                      sx={{ mr: 1, bgcolor: 'green', color: 'white' }}
                    >
                      <FaClipboard style={{ fontSize: '16px' }} />
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditUrl(url.url_id)}
                      sx={{ mr: 1, bgcolor: 'blue', color: 'white' }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUrl(url.url_id)}
                      sx={{ mr: 1, bgcolor: 'red', color: 'white' }}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <QRCode value={`http://localhost:3000/api/urls/redirect/${url.short_url}`} size={50} />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit URL
          </Typography>
          <TextField
            fullWidth
            label="Original URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Short URL"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            fullWidth
            label="Type"
            value={urlType}
            onChange={(e) => setUrlType(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            value={urlTag}
            onChange={(e) => setUrlTag(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value={1}>Simple</MenuItem>
            <MenuItem value={17}>Product</MenuItem>
            <MenuItem value={18}>New</MenuItem>
          </Select>
          <Box textAlign="center">
            <Button onClick={handleSaveChanges} variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MyUrls;
