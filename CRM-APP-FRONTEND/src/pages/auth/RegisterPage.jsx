import { useState } from "react";
import { apiPost } from "../../services/api";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const RequiredLabel = ({ label }) => (
    <Typography variant="body2" mb={0.5}>
      {label} <span style={{ color: "#d32f2f" }}>*</span>
    </Typography>
  );

  const OptionalLabel = ({ label }) => (
    <Typography variant="body2" mb={0.5}>
      {label}
    </Typography>
  );

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
        if (!form.firstName.trim()) {
          newErrors.firstName = "First name is required";
        } else {
          newErrors.firstName = "";
        }
        break;
      case "lastName":
        if (!form.lastName.trim()) {
          newErrors.lastName = "Last name is required";
        } else {
          newErrors.lastName = "";
        }
        break;
      case "email":
        if (!form.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!isValidEmail(form.email)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          newErrors.email = "";
        }
        break;
      case "password":
        if (!form.password.trim()) {
          newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else {
          newErrors.password = "";
        }
        break;
      case "confirmPassword":
        if (!form.confirmPassword.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      industry,
      country,
      password,
      confirmPassword,
    } = form;


    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);


    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const res = await apiPost("/auth/register/", {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company,
        industry,
        country,
        password,
        confirm_password: confirmPassword,
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.email) {
          setErrors({ ...newErrors, email: data.email[0] });
        }
        toast.error(data.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("Registration successful! Please log in.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error("Network error. Make sure the backend server is running.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: "848px",
          mx: 2,
          p: { xs: "16px", sm: "24px" },
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Create Your Account
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Join our CRM platform to manage your business
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: { xs: "16px", sm: "24px" },
            rowGap: "16px",
          }}
        >
          <Box>
            <RequiredLabel label="First Name" />
            <TextField
              name="firstName"
              fullWidth
              size="small"
              placeholder="Enter your first name"
              value={form.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Box>
          <Box>
            <RequiredLabel label="Last Name" />
            <TextField
              name="lastName"
              fullWidth
              size="small"
              placeholder="Enter your last name"
              value={form.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>
          <Box>
            <RequiredLabel label="Email" />
            <TextField
              name="email"
              fullWidth
              size="small"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>
          <Box>
            <OptionalLabel label="Phone Number" />
            <TextField
              name="phone"
              fullWidth
              size="small"
              placeholder="Enter your mobile number"
              value={form.phone}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <RequiredLabel label="Password" />
            <TextField
              type="password"
              name="password"
              fullWidth
              size="small"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              error={!!errors.password}
              helperText={errors.password || "At least 6 characters"}
            />
          </Box>
          <Box>
            <RequiredLabel label="Confirm Password" />
            <TextField
              type="password"
              name="confirmPassword"
              fullWidth
              size="small"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Box>
          <Box>
            <OptionalLabel label="Company Name" />
            <TextField
              name="company"
              fullWidth
              size="small"
              placeholder="Enter your company name"
              value={form.company}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <OptionalLabel label="Industry Type" />
            <TextField
              select
              fullWidth
              size="small"
              name="industry"
              value={form.industry}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) =>
                  selected || (
                    <span style={{ color: "#9e9e9e" }}>Choose industry</span>
                  ),
              }}
              onChange={handleChange}
            >
              <MenuItem value="IT">IT & Software</MenuItem>
              <MenuItem value="Finance">Finance & Banking</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Retail">Retail & E-commerce</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Box>
          <Box>
            <OptionalLabel label="Country or Region" />
            <TextField
              name="country"
              fullWidth
              size="small"
              placeholder="Enter your country or region"
              value={form.country}
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1 / span 2" },
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Button
              type="submit"
              fullWidth
              sx={{
                maxWidth: "412px",
                height: "44px",
                backgroundColor: "#5b4ddb",
                color: "#fff",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#4a3fcf" },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Paper>

      <Typography mt={3} variant="body2">
        Already have an account?{" "}
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            color: "#5b4ddb",
            cursor: "pointer",
            textDecoration: "none",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Login
        </Typography>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
