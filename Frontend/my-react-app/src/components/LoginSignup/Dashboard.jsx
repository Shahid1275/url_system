
import React, { useState } from "react";
import { Button, TextField, MenuItem, Typography, Alert, Paper, Grid, InputLabel, FormControl, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  boxShadow: theme.shadows[6],
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.default,
  maxWidth: '600px',
  margin: 'auto',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
    transition: 'all 0.3s ease',
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 'bold',
  borderRadius: theme.shape.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: '2rem',
  },
}));

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [urlType, setUrlType] = useState("store");
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [urlTag, setUrlTag] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const today = new Date();

  const handleGenerateShortUrl = async () => {
    if (!originalUrl) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          original_url: originalUrl,
          short_url: "",
          url_type: urlType,
          tag_id: urlTag,
          expiration_date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
          status: "active",
          associated_at: new Date().toISOString().split("T")[0],
        }),
      });

      if (response.ok) {
        const newUrl = await response.json();
        setShortUrl(`http://localhost:3000/api/urls/redirect/${newUrl.short_url}`);
        setShowAlert(false);
      } else {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000); // Set alert timeout for 2 seconds
      }
    } catch (error) {
      console.error("Error generating short URL:", error);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000); // Set alert timeout for 2 seconds
    }
  };

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadUrl = (url) => {
    const element = document.createElement("a");
    const file = new Blob([url], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "short_url.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <StyledPaper>
      <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="bold">
        URL Shortener Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type of URL</InputLabel>
            <Select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value)}
              label="Type of URL"
              style={{ borderRadius: '10px' }}
            >
              <MenuItem value="store">Store</MenuItem>
              <MenuItem value="misc">Misc</MenuItem>
              <MenuItem value="product">Product</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>URL Tag</InputLabel>
            <Select
              value={urlTag}
              onChange={(e) => setUrlTag(e.target.value)}
              label="URL Tag"
              style={{ borderRadius: '10px' }}
            >
              <MenuItem value="">Select Tag</MenuItem>
              <MenuItem value="1">Simple</MenuItem>
              <MenuItem value="18">New</MenuItem>
              <MenuItem value="17">Product</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiration date"
            minDate={today}
            customInput={<TextField fullWidth variant="outlined" label="Expiration Date" />}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerateShortUrl}
          >
            Generate Short URL
          </StyledButton>
        </Grid>
      </Grid>

      {showAlert && (
        <StyledAlert severity="error">
          An error occurred while generating the short URL. Please try again.
        </StyledAlert>
      )}

      {copySuccess && (
        <StyledAlert severity="success">
          URL copied to clipboard!
        </StyledAlert>
      )}

      {shortUrl && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Your generated short URL:
          </Typography>
          <Typography variant="body1" style={{ wordWrap: 'break-word' }}>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
              {shortUrl}
            </a>
          </Typography>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={() => handleCopyToClipboard(shortUrl)}
            style={{ marginTop: '16px' }}
          >
            Copy
          </StyledButton>
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={() => handleDownloadUrl(shortUrl)}
            style={{ marginTop: '16px', marginLeft: '16px' }}
          >
            Download
          </StyledButton>
        </div>
      )}
    </StyledPaper>
  );
};

export default Dashboard;
