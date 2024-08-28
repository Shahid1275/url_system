import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"], "Role is required").optional(),
});

const LoginSignup = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "user",
    },
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
    setSuccessMessage(''); // Clear success message when toggling forms
    setErrorMessage(''); // Clear error message when toggling forms
  };

  const onSubmit = async (data) => {
    try {
      const parsedData = schema.parse(data);
      const endpoint = isLogin
        ? "http://localhost:3000/api/auth/login"
        : "http://localhost:3000/api/auth/signup";
  
      const requestData = {
        username: parsedData.username,
        password_hash: parsedData.password,
      };
  
      if (!isLogin) {
        requestData.email = parsedData.email;
        requestData.role_id = parsedData.role === "admin" ? 1 : 2;
      }
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const result = await response.json();
      setToken(result.token);
      localStorage.setItem("token", result.token);
      
      if (response.ok) {
        if (isLogin) {
          const decoded = jwtDecode(result.token);
          localStorage.setItem("user_id", decoded.userId);
          reset();
          setSuccessMessage("Login successful!");
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          setSuccessMessage("Signup successful! Please log in.");
          setTimeout(() => {
            toggleForm(); // Delay toggling the form
          }, 1500); // Show success message for 1.5 seconds
        }
      } else {
        if (response.status === 409) {
          setErrorMessage("Username or email already exists.");
        } else {
          setErrorMessage(result.error || "An error occurred. Please try again.");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(({ path, message }) => {
          setError(path[0], { type: "manual", message });
        });
      }
    }
  };
  

  return (
    <div className="login-signup-container">
      <div className="form-container">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message */}
        <h2>{isLogin ? "Login" : "Signup"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <img src={user_icon} alt="User Icon" className="icon" />
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>
          {!isLogin && (
            <div className="input-group">
              <img src={email_icon} alt="Email Icon" className="icon" />
              <input type="email" placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>
          )}
          <div className="input-group">
            <img src={password_icon} alt="Password Icon" className="icon" />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>
          {!isLogin && (
            <div className="role-selection">
              <label className="role-label">Select Role:</label>
              <div className="role-options">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="user"
                    {...register("role")}
                  />
                  <label className="form-check-label">User</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="admin"
                    {...register("role")}
                  />
                  <label className="form-check-label">Admin</label>
                </div>
              </div>
              {errors.role && (
                <p className="error-text">{errors.role.message}</p>
              )}
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span className="toggle-link" onClick={toggleForm}>
            {isLogin ? " Signup" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
