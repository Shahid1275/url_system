
// import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import "./App.css";
// import Home from "./components/Pages/Home";
// import LoginSignup from "./components/LoginSignup/LoginSingup"


// const App = () => {
//   return (
//     <BrowserRouter>
//      <Routes>
//         <Route path="/" element={<LoginSignup />} />
//         <Route path="/home/*" element={<Home />} />

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Pages/Home";
import "./App.css";
import LoginSignup from "./components/LoginSignup/LoginSingup"
import ProtectedRoute from "./components/LoginSignup/protectedRoutes";
const App = () => {
  // useEffect(()=>{},[])
  const isAuthenticated = () => {
    return !!localStorage.getItem('token'); 
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={ <LoginSignup />}
        /> 
        <Route  element={<ProtectedRoute />} >
        
        <Route
          path="/home/*"
          element={ <Home />  }
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
