
import React, { useState } from "react";
import { Button, TextField, MenuItem, Typography, Alert, Paper, Grid, InputLabel, FormControl, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  boxShadow: theme.shadows[5],
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
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/urls", {
        method: "POST",
         
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + localStorage.getItem('token')
          
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
      }
    } catch (error) {
      console.error("Error generating short URL:", error);
      setShowAlert(true);
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
      <Typography variant="h4" gutterBottom>
        URL Shortener Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type of URL</InputLabel>
            <Select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value)}
              label="Type of URL"
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerateShortUrl}
          >
            Generate Short URL
          </Button>
        </Grid>
      </Grid>

      {showAlert && (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          An error occurred while generating the short URL. Please try again.
        </Alert>
      )}

      {copySuccess && (
        <Alert severity="success" style={{ marginTop: '16px' }}>
          URL copied to clipboard!
        </Alert>
      )}

      {shortUrl && (
        <div style={{ marginTop: '16px' }}>
          <Typography variant="body1">
            Your generated short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleCopyToClipboard(shortUrl)}
          >
            Copy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDownloadUrl(shortUrl)}
            style={{ marginLeft: '16px' }}
          >
            Download
          </Button>
        </div>
      )}
    </StyledPaper>
  );
};

export default Dashboard;
