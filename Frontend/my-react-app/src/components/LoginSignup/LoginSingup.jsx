import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  IconButton,
  Box,
  InputAdornment,
  Fade,
} from "@mui/material";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
const schema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"], "Role is required").optional(),
});

const LoginSignup = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
    setSuccessMessage("");
    setErrorMessage("");
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
          navigate("/home");
        } else {
          setSuccessMessage("Signup successful! Please log in.");
          setTimeout(() => {
            toggleForm();
          }, 1500);
        }
      } else {
        setErrorMessage(
          response.status === 409
            ? "Username or email already exists."
            : result.error || "An error occurred. Please try again."
        );
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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on larger screens
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{display:'flex',flexDirection:'row',alignItems:'center',}}>
        <div>
          <img src="Mobile login-pana.png" height={500}></img>
        </div>
        {/* Form Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
            maxWidth: 400,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
            },
            zIndex: 1,
          }}
        >
          <Box sx={{ width: "100%" }}>
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Fade in timeout={1000}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  marginBottom: 3,
                  textAlign: "center",
                  color: "#333",
                }}
              >
                Welcome to Our Service
              </Typography>
            </Fade>

            <Typography variant="h5" gutterBottom textAlign="center">
              {isLogin ? "Login" : "Signup"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...register("username")}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              {!isLogin && (
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  {...register("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  {...register("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              {!isLogin && (
                <FormControl component="fieldset" fullWidth margin="normal">
                  <Typography variant="subtitle1">Select Role:</Typography>
                  <RadioGroup row {...register("role")}>
                    <FormControlLabel
                      value="user"
                      control={<Radio />}
                      label="User"
                    />
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label="Admin"
                    />
                  </RadioGroup>
                </FormControl>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isLogin ? "Login" : "Signup"}
              </Button>

              <Typography variant="body2" align="center" marginTop={2}>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button onClick={toggleForm} color="primary">
                  {isLogin ? " Signup" : " Login"}
                </Button>
              </Typography>
            </form>
          </Box>
        </Box>
      </div>

      {/* Image Section */}
    </Box>
  );
};

export default LoginSignup;
