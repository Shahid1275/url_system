
import React, { useState, useEffect } from 'react';
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
          console.log('Fetched API Key:', data); 

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
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">API Key Management</h2>
      <div className="button-group mb-4">
        <button className="btn btn-primary" onClick={() => handleApiKey('generate')}>
          Generate API Key
        </button>
        <button className="btn btn-danger ml-2" onClick={() => handleApiKey('delete')}>
          Delete API Key
        </button>
      </div>

      {apiKey && (
        <div className="api-key-container mt-4">
          <h4>Your API Key:</h4>
          <div className="api-key-box">
            <p>{apiKey}</p>
          </div>
        </div>
      )}

      {successMessage && <p className="success-text mt-3">{successMessage}</p>}
      {error && <p className="error-text mt-3">{error}</p>}
    </div>
  );
}

export default ApiKey;
