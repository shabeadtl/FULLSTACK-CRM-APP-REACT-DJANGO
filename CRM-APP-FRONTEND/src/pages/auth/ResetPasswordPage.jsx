import { useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { apiPost } from "../../services/api";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    const RequiredLabel = ({ label }) => (
        <Typography variant="body2" mb={0.5}>
            {label} <span style={{ color: "#d32f2f" }}>*</span>
        </Typography>
    );

    const validate = () => {
        const newErrors = { password: "", confirmPassword: "" };

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
        return !newErrors.password && !newErrors.confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await apiPost("/auth/reset-password/", {
                uid,
                token,
                password,
                confirm_password: confirmPassword,
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to reset password. The link may have expired.");
                return;
            }

            toast.success("Password reset successful! You can now log in.");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error("Network error. Make sure the backend server is running.");
        } finally {
            setLoading(false);
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
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <LockResetIcon sx={{ fontSize: 48, color: "#5b4ddb", mb: 1 }} />
                </Box>

                <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
                    Set New Password
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mb={3}
                >
                    Enter your new password below
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <RequiredLabel label="New Password" />
                    <TextField
                        placeholder="Enter new password"
                        fullWidth
                        size="small"
                        margin="dense"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: "" });
                        }}
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

                    <Box sx={{ mt: 2 }}>
                        <RequiredLabel label="Confirm Password" />
                    </Box>
                    <TextField
                        placeholder="Confirm new password"
                        fullWidth
                        size="small"
                        margin="dense"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword)
                                setErrors({ ...errors, confirmPassword: "" });
                        }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? (
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
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.2,
                            backgroundColor: "#5b4ddb",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": { backgroundColor: "#4a3fcf" },
                            "&:disabled": { backgroundColor: "#9e95e8", color: "#fff" },
                        }}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    textAlign="center"
                    mt={3}
                    color="text.secondary"
                >
                    Remember your password?{" "}
                    <Typography
                        component={RouterLink}
                        to="/"
                        sx={{
                            color: "#5b4ddb",
                            textDecoration: "none",
                            fontWeight: 500,
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Back to Login
                    </Typography>
                </Typography>
            </Paper>
        </Box>
    );
};

export default ResetPasswordPage;
