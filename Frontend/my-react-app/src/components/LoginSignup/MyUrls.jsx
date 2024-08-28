import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import QRCode from 'qrcode.react';
import { FaEdit, FaTrash, FaClipboard } from 'react-icons/fa'; // Import icons

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlType, setUrlType] = useState('misc');
  const [urlTag, setUrlTag] = useState(1);
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [copyMessageId, setCopyMessageId] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/urls',{
          headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }})
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
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`,

        },
        method: 'DELETE',
      });
      setUrls(urls.filter((url) => url.url_id !== urlId));
    } catch (error) {
      console.error('Failed to delete URL:', error);
    }
  };

  const handleCopyToClipboard = (url, urlId) => {
    navigator.clipboard.writeText(url);
    setCopyMessageId(urlId);
    setTimeout(() => setCopyMessageId(null), 2000); // Hide message after 2 seconds
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
      } catch (error) {
        console.error('Failed to update URL:', error);
      }
    }
  };

  const handleFilterChange = (eventKey) => {
    setSelectedTag(eventKey);
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
      <h1 className="mb-4">My URLs</h1>
      <Dropdown onSelect={handleFilterChange} className="mb-4">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Filter by Tag
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          <Dropdown.Item eventKey="1">Simple</Dropdown.Item>
          <Dropdown.Item eventKey="17">Product</Dropdown.Item>
          <Dropdown.Item eventKey="18">New</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Type</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUrls.map((url, index) => (
            <tr key={url.url_id}>
              <td>{index + 1}</td>
              <td>{url.original_url}</td>
              <td>
                <a
                  href={`http://localhost:3000/api/urls/redirect/${url.short_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.short_url}
                </a>
              </td>
              <td>{url.url_type}</td>
              <td>{getTagNameById(url.tag_id)}</td>
              <td>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="link"
                    onClick={() => handleCopyToClipboard(url.short_url, url.url_id)}
                    className="me-2"
                  >
                    {copyMessageId === url.url_id && (
                      <span className="text-success me-2">Copied!</span>
                    )}
                    <FaClipboard />
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleEditUrl(url.url_id)}
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUrl(url.url_id)}
                    className="me-2"
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleCopyToClipboard(url.short_url, url.url_id)}
                  >
                    <QRCode value={`http://localhost:3000/api/urls/redirect/${url.short_url}`} size={50} />
                  </Button>
                </div>
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
            <Form.Group>
              <Form.Label>Original URL</Form.Label>
              <Form.Control
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Short URL</Form.Label>
              <Form.Control
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={urlType}
                onChange={(e) => setUrlType(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tag</Form.Label>
              <Form.Control
                as="select"
                value={urlTag}
                onChange={(e) => setUrlTag(parseInt(e.target.value))}
              >
                <option value="1">Simple</option>
                <option value="17">Product</option>
                <option value="18">New</option>
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

export default MyUrls;
