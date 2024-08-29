// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './UrlStats.css';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend
// } from 'chart.js';
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend
// );

// const UrlStats = () => {
//   const [urls, setUrls] = useState([]);
//   const [stats, setStats] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedUrlId, setSelectedUrlId] = useState(null);

//   useEffect(() => {
//     const fetchUrls = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/urls',{
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }

//         );
//         if (!response.ok) {
//           throw new Error('Failed to fetch URLs');
//         }

//         const data = await response.json();
//         setUrls(data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch URLs.');
//       }
//     };

//     fetchUrls();
//   }, []);

//   const fetchUrlStats = async (url_id) => {
//     console.log('URL ID:', url_id);

//     try {
//       const response = await fetch(`http://localhost:3000/api/stats/${url_id}`,{
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
        
//       if (!response.ok) {
//         console.error(`Error: ${response.status} ${response.statusText}`);
//         throw new Error('Failed to fetch URL statistics');
//       }

//       const data = await response.json();
//       setStats(data);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching URL statistics:', err.message);
//       setError('Failed to fetch URL statistics.');
//       setStats([]);
//     }
//   };

//   const handleUrlClick = (url_id) => {
//     setSelectedUrlId(url_id);
//     fetchUrlStats(url_id);
//   };

//   const getChartData = () => {
//     if (stats.length === 0) return {};

//     const labels = stats.map(stat => new Date(stat.access_date).toLocaleDateString());
//     const data = stats.map(stat => stat.click_id); // Example: Click IDs for demo purposes

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Clicks Over Time',
//           data,
//           backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
//           borderColor: 'rgba(75, 192, 192, 1)', // Border color of bars
//           borderWidth: 1, // Border width of bars
//         },
//       ],
//     };
//   };

//   return (
//     <div className="container my-4">
//       <h1 className="mb-4 text-primary">URL Statistics</h1>
      
//       {error && <div className="alert alert-danger">{error}</div>}
      
//       <div className="mb-4">
//         <h2 className="text-secondary">All URLs</h2>
//         <ul className="list-group">
//           {urls.map((url) => (
//             <li key={url.url_id} className="list-group-item">
//               <button
//                 className="btn btn-outline-primary w-100 text-left"
//                 onClick={() => handleUrlClick(url.url_id)}
//               >
//                 <strong>{url.short_url}</strong> - {url.original_url}
//               </button>
              
//               {selectedUrlId === url.url_id && (
//                 <>
//                   <div className="mt-4">
//                     <h3 className="text-secondary">Statistics for URL ID: {selectedUrlId}</h3>
//                     <table className="table table-striped table-bordered mt-4">
//                       <thead className="thead-dark">
//                         <tr>
//                           <th>Click ID</th>
//                           <th>Access Date</th>
//                           <th>Access Time</th>
//                           <th>IP Address</th>
//                           <th>User Agent</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {stats.length > 0 ? (
//                           stats.map((stat) => (
//                             <tr key={stat.click_id}>
//                               <td>{stat.click_id}</td>
//                               <td>{new Date(stat.access_date).toLocaleDateString()}</td>
//                               <td>{new Date(stat.access_time).toLocaleTimeString()}</td>
//                               <td>{stat.ip_address}</td>
//                               <td>{stat.user_agent}</td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="5" className="text-center">No statistics available for this URL.</td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   {stats.length > 0 && (
//                     <div className="mt-4">
//                       <h3 className="text-secondary">Statistics Graph</h3>
//                       <div style={{ height: '400px' }}>
//                         <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default UrlStats;
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Container,
  Typography,
  Button,
  Alert,
  List,
  Collapse,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Animation for collapse
const slideIn = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
`;

const ExpandButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  textTransform: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(1, 2),
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    boxShadow: theme.shadows[6],
    transform: 'scale(1.02)',
  },
}));

const CollapseContent = styled(Collapse)(({ theme }) => ({
  animation: `${slideIn} 0.3s ease-out`,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'scale(1.02)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiAlert-message': {
    fontSize: '1rem',
  },
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const UrlStats = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [selectedUrlId, setSelectedUrlId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/urls', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
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
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/stats/${url_id}`, {
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
    setLoading(false);
  };

  const handleUrlClick = (url_id) => {
    setSelectedUrlId(selectedUrlId === url_id ? null : url_id);
    if (selectedUrlId !== url_id) {
      fetchUrlStats(url_id);
    }
  };

  const getChartData = () => {
    if (stats.length === 0) return {};

    const labels = stats.map(stat => new Date(stat.access_date).toLocaleDateString());
    const data = stats.map(stat => stat.click_id);

    return {
      labels,
      datasets: [
        {
          label: 'Clicks Over Time',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
          hoverBorderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Clicks: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#eee',
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        URL Statistics
      </Typography>

      {error && <StyledAlert severity="error">{error}</StyledAlert>}
      
      <List>
        {urls.length === 0 && !loading && (
          <Typography variant="body1" color="textSecondary">No URLs available.</Typography>
        )}

        {urls.map((url) => (
          <React.Fragment key={url.url_id}>
            <ExpandButton
              onClick={() => handleUrlClick(url.url_id)}
              endIcon={selectedUrlId === url.url_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              <Typography variant="h6">{url.short_url}</Typography>
            </ExpandButton>
            <CollapseContent in={selectedUrlId === url.url_id}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <LoadingSpinner />
                </Box>
              ) : (
                <StyledCard sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Original URL: {url.original_url}
                    </Typography>

                    {stats.length > 0 ? (
                      <>
                        <StyledTableContainer component={Paper} sx={{ mt: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Click ID</TableCell>
                                <TableCell>Access Date</TableCell>
                                <TableCell>Access Time</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>User Agent</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {stats.map((stat) => (
                                <StyledTableRow key={stat.click_id}>
                                  <TableCell>{stat.click_id}</TableCell>
                                  <TableCell>{new Date(stat.access_date).toLocaleDateString()}</TableCell>
                                  <TableCell>{new Date(stat.access_time).toLocaleTimeString()}</TableCell>
                                  <TableCell>{stat.ip_address}</TableCell>
                                  <TableCell>{stat.user_agent}</TableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </StyledTableContainer>

                        <Box mt={4}>
                          <Typography variant="h6" color="textSecondary" gutterBottom>
                            Clicks Chart
                          </Typography>
                          <Box sx={{ height: 400 }}>
                            <Bar data={getChartData()} options={chartOptions} />
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        No statistics available for this URL.
                      </Typography>
                    )}
                  </CardContent>
                </StyledCard>
              )}
            </CollapseContent>
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default UrlStats;
