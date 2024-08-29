
import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Modal,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import QRCode from 'qrcode.react';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';

const PreGeneratedUrls = () => {
  // State hooks
  const [quantity, setQuantity] = useState(1);
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [shortUrl, setShortUrl] = useState('');
  const [urlType, setUrlType] = useState('misc');
  const [urlTag, setUrlTag] = useState(1);
  const [generateUrlType, setGenerateUrlType] = useState('misc');
  const [generateUrlTag, setGenerateUrlTag] = useState(1);
  const [copyMessageId, setCopyMessageId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const savedUrls = localStorage.getItem('urls');
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
  }, []);

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleGenerateUrlTypeChange = (e) => setGenerateUrlType(e.target.value);
  const handleGenerateUrlTagChange = (e) => setGenerateUrlTag(parseInt(e.target.value));

  // Generate multiple URLs
  const generateUrls = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/urls/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          quantity,
          url_type: generateUrlType,
          tag_id: generateUrlTag,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate URLs');
      }

      const data = await response.json();
      const newUrls = [...urls, ...data];
      setUrls(newUrls);
      localStorage.setItem('urls', JSON.stringify(newUrls)); // Save to local storage
      setSnackbarMessage('URLs generated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating URLs:', error);
      setSnackbarMessage('Failed to generate URLs.');
      setSnackbarOpen(true);
    }
  };

  // Handle URL edit
  const handleEditUrl = (urlId) => {
    const urlToEdit = urls.find((url) => url.url_id === urlId);
    if (urlToEdit) {
      setEditingUrlId(urlId);
      setShortUrl(urlToEdit.short_url);
      setUrlType(urlToEdit.url_type);
      setUrlTag(urlToEdit.tag_id || 1);
      setShowModal(true);
    }
  };

  // Save changes for the edited URL
  const handleSaveChanges = async () => {
    if (editingUrlId) {
      try {
        await fetch(`http://localhost:3000/api/urls/${editingUrlId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            short_url: shortUrl,
            url_type: urlType,
            tag_id: urlTag,
          }),
        });
        const updatedUrls = urls.map((url) =>
          url.url_id === editingUrlId
            ? { ...url, short_url: shortUrl, url_type: urlType, tag_id: urlTag }
            : url
        );
        setUrls(updatedUrls);
        localStorage.setItem('urls', JSON.stringify(updatedUrls)); // Update local storage
        handleCloseModal();
        setSnackbarMessage('URL updated successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to update URL:', error);
        setSnackbarMessage('Failed to update URL.');
        setSnackbarOpen(true);
      }
    }
  };

  // Close the edit modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShortUrl('');
    setUrlType('misc');
    setUrlTag(1);
    setEditingUrlId(null);
  };

  // Delete URL
  const handleDeleteUrl = async (urlId) => {
    try {
      await fetch(`http://localhost:3000/api/urls/${urlId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedUrls = urls.filter((url) => url.url_id !== urlId);
      setUrls(updatedUrls);
      localStorage.setItem('urls', JSON.stringify(updatedUrls)); // Update local storage
      setSnackbarMessage('URL deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to delete URL:', error);
      setSnackbarMessage('Failed to delete URL.');
      setSnackbarOpen(true);
    }
  };

  // Copy URL to clipboard
  const handleCopyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopyMessageId(id);
        setTimeout(() => setCopyMessageId(null), 2000); // Hide message after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy the URL:', err);
      });
  };

  // Get tag name by ID
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
      <Typography variant="h4" gutterBottom>
        Generate Pre-generated URLs
      </Typography>

      <Box display="flex" flexDirection="row" mb={2}>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ mr: 2 }}
        />
        <Select
          value={generateUrlType}
          onChange={handleGenerateUrlTypeChange}
          displayEmpty
          sx={{ mr: 2, minWidth: 120 }}
        >
          <MenuItem value="misc">Misc</MenuItem>
          <MenuItem value="product">Product</MenuItem>
          <MenuItem value="store">Store</MenuItem>
        </Select>
        <Select
          value={generateUrlTag}
          onChange={handleGenerateUrlTagChange}
          displayEmpty
          sx={{ mr: 2, minWidth: 120 }}
        >
          <MenuItem value="18">New</MenuItem>
          <MenuItem value="1">Simple</MenuItem>
          <MenuItem value="17">Product</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={generateUrls}>
          Generate URLs
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>QR Code</TableCell> {/* New column for QR Code */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url, index) => (
              <TableRow key={url.url_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <a href={url.short_url} target="_blank" rel="noopener noreferrer">
                    {url.short_url}
                  </a>
                </TableCell>
                <TableCell>{url.url_type}</TableCell>
                <TableCell>{getTagNameById(url.tag_id)}</TableCell>
                <TableCell>
                  <QRCode value={url.short_url} size={60} /> {/* QR Code for each URL */}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleEditUrl(url.url_id)}
                    sx={{ mr: 1 }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUrl(url.url_id)}
                    sx={{ mr: 1 }}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleCopyToClipboard(url.short_url, url.url_id)}
                  >
                    <FaCopy />
                  </Button>
                  {copyMessageId === url.url_id && <Typography variant="body2" color="textSecondary">Copied!</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
      >
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
            label="Short URL"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            value={urlType}
            onChange={(e) => setUrlType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="misc">Misc</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="store">Store</MenuItem>
          </Select>
          <Select
            fullWidth
            value={urlTag}
            onChange={(e) => setUrlTag(parseInt(e.target.value))}
            sx={{ mb: 2 }}
          >
            <MenuItem value="18">New</MenuItem>
            <MenuItem value="1">Simple</MenuItem>
            <MenuItem value="17">Product</MenuItem>
          </Select>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PreGeneratedUrls;
