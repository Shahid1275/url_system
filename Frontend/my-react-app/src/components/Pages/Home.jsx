

import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../LoginSignup/sideBar";
import Dashboard from "../LoginSignup/Dashboard";
import ApiKey from "../LoginSignup/Apikey";
import UrlStats from "../LoginSignup/UrlStats";
import { Typography, Box } from "@mui/material";
import PreGeneratedUrls from "../LoginSignup/pregeneratedurls";

import "./Home.css";
import MyUrls from "../LoginSignup/MyUrls";

const Home = () => {
  return (

    <div className="home-container">
      
      <Sidebar />
      <div style={{ margin: 'auto' }} className="content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="apikey" element={<ApiKey />} />
          <Route path="urlStats" element={<UrlStats />} />
          <Route path="pregeneratedurls" element={<PreGeneratedUrls />} />
          <Route path="MyUrls" element={<MyUrls />} />
        </Routes>
      </div>
    </div>
    
  );
};

export default Home;
