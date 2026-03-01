import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { apiPost } from "../../services/api";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  const RequiredLabel = ({ label }) => (
    <Typography variant="body2" mb={0.5}>
      {label} <span style={{ color: "#d32f2f" }}>*</span>
    </Typography>
  );

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (field === "email") {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!isValidEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    }

    if (field === "password") {
      if (!password.trim()) {
        newErrors.password = "Password is required";
      } else {
        newErrors.password = "";
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const res = await apiPost("/auth/login/", { email, password });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid email or password");
        return;
      }
      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      localStorage.setItem("token", data.tokens.access);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast.success("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error("Network error. Make sure the backend server is running.");
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail.trim()) {
      setForgotError("Email is required");
      return;
    }

    if (!isValidEmail(forgotEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }

    try {
      const res = await apiPost("/auth/forgot-password/", { email: forgotEmail });
      const data = await res.json();

      if (!res.ok) {
        setForgotError(data.error || "Something went wrong");
        return;
      }

      setForgotOpen(false);
      setForgotEmail("");
      setForgotError("");
      toast.success("Password reset link sent! Check the backend terminal.");
    } catch (err) {
      setForgotError("Network error. Make sure the backend server is running.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f8fc",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Sign in to your CRM account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <RequiredLabel label="Email" />
          <TextField
            placeholder="Enter your email"
            fullWidth
            size="small"
            margin="dense"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            onBlur={() => handleBlur("email")}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailOutlinedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <RequiredLabel label="Password" />
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="none"
              sx={{ color: "#5b4ddb", fontSize: "12px" }}
              onClick={() => setForgotOpen(true)}
            >
              Forgot password?
            </Link>
          </Box>

          <TextField
            placeholder="Enter your password"
            fullWidth
            size="small"
            margin="dense"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            onBlur={() => handleBlur("password")}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#5b4ddb",
              color: "#fff",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#4a3fcf" },
            }}
          >
            Log in
          </Button>
        </Box>

        <Typography
          variant="body2"
          textAlign="center"
          mt={3}
          color="text.secondary"
        >
          Don't have an account?{" "}
          <Typography
            component={RouterLink}
            to="/register"
            sx={{
              color: "#5b4ddb",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign up
          </Typography>
        </Typography>
        <Dialog
          open={forgotOpen}
          onClose={() => {
            setForgotOpen(false);
            setForgotEmail("");
            setForgotError("");
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Reset Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>
            <Typography variant="body2" mb={0.5}>
              Email <span style={{ color: "#d32f2f" }}>*</span>
            </Typography>
            <TextField
              placeholder="Enter your email"
              fullWidth
              size="small"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                setForgotError("");
              }}
              error={!!forgotError}
              helperText={forgotError}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setForgotOpen(false);
                setForgotEmail("");
                setForgotError("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#5b4ddb", "&:hover": { backgroundColor: "#4a3fcf" } }}
              onClick={handleForgotSubmit}
            >
              Send Reset Link
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default LoginPage;
