
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  VpnKey as ApiKeyIcon,
  Link as MyUrlsIcon,
  LinkOff as PreGeneratedUrlsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Optionally, clear other session data
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 230 : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? 240 : 64,
            boxSizing: "border-box",
            transition: "width 0.3s",
            backgroundColor: "#F5F5F5", // You can customize the background color here
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to="dashboard"
            sx={{
              "&:hover": {
                backgroundColor: "darkgrey", // Light grey hover effect
                color: "#1976D2", // Text color on hover (optional)
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Dashboard" />}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="apikey"
            sx={{
              "&:hover": {
                backgroundColor: "darkgrey",
                color: "#1976D2",
              },
            }}
          >
            <ListItemIcon>
              <ApiKeyIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="API Key" />}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="urlstats"
            sx={{
              "&:hover": {
                backgroundColor: "darkgrey",
                color: "#1976D2",
              },
            }}
          >
            <ListItemIcon>
              <MyUrlsIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="URL Stats" />}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="pregeneratedurls"
            sx={{
              "&:hover": {
                backgroundColor: "darkgrey",
                color: "#1976D2",
              },
            }}
          >
            <ListItemIcon>
              <PreGeneratedUrlsIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Pre-generated URLs" />}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="MyUrls"
            sx={{
              "&:hover": {
                backgroundColor: "darkgrey",
                color: "#1976D2",
              },
            }}
          >
            <ListItemIcon>
              <MyUrlsIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="My URLs" />}
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "#E0E0E0",
                color: "#D32F2F",
                cursor: "pointer",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Main content goes here */}
      </Box>
    </Box>
  );
};

export default Sidebar;
