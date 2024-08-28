
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Pages/Home";
import LoginSignup from "./components/LoginSignup/LoginSingup"


const App = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home/*" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;