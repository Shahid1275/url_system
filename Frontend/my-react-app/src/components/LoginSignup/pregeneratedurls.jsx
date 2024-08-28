import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import QRCode from 'qrcode.react';

const PreGeneratedUrls = () => {
  // State hooks
  const [quantity, setQuantity] = useState(1);
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [shortUrl, setShortUrl] = useState('');
  const [urlType, setUrlType] = useState('misc');
  const [urlTag, setUrlTag] = useState([]);
  const [generateUrlType, setGenerateUrlType] = useState('misc');
  const [generateUrlTag, setGenerateUrlTag] = useState(urlTag);
  const [copyMessageId, setCopyMessageId] = useState(null);

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
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          
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
    } catch (error) {
      console.error('Error generating URLs:', error);
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
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
      } catch (error) {
        console.error('Failed to update URL:', error);
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
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedUrls = urls.filter((url) => url.url_id !== urlId);
      setUrls(updatedUrls);
      localStorage.setItem('urls', JSON.stringify(updatedUrls)); // Update local storage
    } catch (error) {
      console.error('Failed to delete URL:', error);
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
      <h2 className="mb-4">Generate Pre-generated URLs</h2>

      <Form inline>
        <Form.Group controlId="generateQuantity">
          <Form.Label className="mr-2">Quantity:</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="mr-2"
          />
        </Form.Group>
        <Form.Group controlId="generateUrlType">
          <Form.Label className="mr-2">URL Type:</Form.Label>
          <Form.Control
            as="select"
            value={generateUrlType}
            onChange={handleGenerateUrlTypeChange}
            className="mr-2"
          >
            <option value="misc">Misc</option>
            <option value="product">Product</option>
            <option value="store">Store</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="generateUrlTag">
          <Form.Label className="mr-2">URL Tag:</Form.Label>
          <Form.Control
            as="select"
            value={generateUrlTag}
            onChange={handleGenerateUrlTagChange}
            className="mr-2"
          >
            <option value="18">New</option>
            <option value="1">Simple</option>
            <option value="17">Product</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={generateUrls}>
          Generate URLs
        </Button>
      </Form>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Short URL</th>
            <th>Type</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, index) => (
            <tr key={url.url_id}>
              <td>{index + 1}</td>
              <td>
                <a href={url.short_url} target="_blank" rel="noopener noreferrer">
                  {url.short_url}
                </a>
              </td>
              <td>{url.url_type}</td>
              <td>{getTagNameById(url.tag_id)}</td>
              <td>
                <Button variant="info" onClick={() => handleEditUrl(url.url_id)} className="mr-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUrl(url.url_id)} className="mr-2">
                  <FaTrash />
                </Button>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Button
                    variant="secondary"
                    onClick={() => handleCopyToClipboard(url.short_url, url.url_id)}
                    className="mr-2"
                  >
                    <FaCopy />
                  </Button>
                  {copyMessageId === url.url_id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '0',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 1,
                      }}
                    >
                       copied!
                    </div>
                  )}
                </div>
                <QRCode value={url.short_url} size={50} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editShortUrl">
              <Form.Label>Short URL</Form.Label>
              <Form.Control
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editUrlType">
              <Form.Label>URL Type</Form.Label>
              <Form.Control
                as="select"
                value={urlType}
                onChange={(e) => setUrlType(e.target.value)}
              >
                <option value="misc">Misc</option>
                <option value="product">Product</option>
                <option value="store">Store</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editUrlTag">
              <Form.Label>URL Tag</Form.Label>
              <Form.Control
                as="select"
                value={urlTag}
                onChange={(e) => setUrlTag(parseInt(e.target.value))}
              >
                <option value="18">New</option>
                <option value="1">Simple</option>
                <option value="17">Product</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreGeneratedUrls;
