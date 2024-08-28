import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UrlStats.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const UrlStats = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [selectedUrlId, setSelectedUrlId] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/urls',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }

        );
        if (!response.ok) {
          throw new Error('Failed to fetch URLs');
        }

        const data = await response.json();
        setUrls(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch URLs.');
      }
    };

    fetchUrls();
  }, []);

  const fetchUrlStats = async (url_id) => {
    console.log('URL ID:', url_id);

    try {
      const response = await fetch(`http://localhost:3000/api/stats/${url_id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
        
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to fetch URL statistics');
      }

      const data = await response.json();
      setStats(data);
      setError('');
    } catch (err) {
      console.error('Error fetching URL statistics:', err.message);
      setError('Failed to fetch URL statistics.');
      setStats([]);
    }
  };

  const handleUrlClick = (url_id) => {
    setSelectedUrlId(url_id);
    fetchUrlStats(url_id);
  };

  const getChartData = () => {
    if (stats.length === 0) return {};

    const labels = stats.map(stat => new Date(stat.access_date).toLocaleDateString());
    const data = stats.map(stat => stat.click_id); // Example: Click IDs for demo purposes

    return {
      labels,
      datasets: [
        {
          label: 'Clicks Over Time',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
          borderColor: 'rgba(75, 192, 192, 1)', // Border color of bars
          borderWidth: 1, // Border width of bars
        },
      ],
    };
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">URL Statistics</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-4">
        <h2 className="text-secondary">All URLs</h2>
        <ul className="list-group">
          {urls.map((url) => (
            <li key={url.url_id} className="list-group-item">
              <button
                className="btn btn-outline-primary w-100 text-left"
                onClick={() => handleUrlClick(url.url_id)}
              >
                <strong>{url.short_url}</strong> - {url.original_url}
              </button>
              
              {selectedUrlId === url.url_id && (
                <>
                  <div className="mt-4">
                    <h3 className="text-secondary">Statistics for URL ID: {selectedUrlId}</h3>
                    <table className="table table-striped table-bordered mt-4">
                      <thead className="thead-dark">
                        <tr>
                          <th>Click ID</th>
                          <th>Access Date</th>
                          <th>Access Time</th>
                          <th>IP Address</th>
                          <th>User Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.length > 0 ? (
                          stats.map((stat) => (
                            <tr key={stat.click_id}>
                              <td>{stat.click_id}</td>
                              <td>{new Date(stat.access_date).toLocaleDateString()}</td>
                              <td>{new Date(stat.access_time).toLocaleTimeString()}</td>
                              <td>{stat.ip_address}</td>
                              <td>{stat.user_agent}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">No statistics available for this URL.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {stats.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-secondary">Statistics Graph</h3>
                      <div style={{ height: '400px' }}>
                        <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UrlStats;
