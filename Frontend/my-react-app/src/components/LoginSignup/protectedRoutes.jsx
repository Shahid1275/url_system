import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom';


const ProtectedRoute = () => {
    const isAuthenticated = () => {
        return localStorage.getItem('token'); 
      };
      console.log(isAuthenticated());
      
  return (
  isAuthenticated() ? <Outlet/> : <Navigate to="/" />
  )
}

export default ProtectedRoute
