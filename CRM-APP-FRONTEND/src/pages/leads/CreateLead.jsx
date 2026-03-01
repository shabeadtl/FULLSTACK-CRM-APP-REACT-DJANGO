import React, { useState, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Button,
    Drawer,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const STATUS = ["New", "Open", "In Progress", "Qualified", "Qualified Lead", "Lost", "Bad Info"];


const FlagIcon = () => (
    <img
        src="https://flagcdn.com/w20/in.png"
        srcSet="https://flagcdn.com/w40/in.png 2x"
        width="24"
        alt="India"
        style={{ borderRadius: "2px" }}
    />
);

export default function CreateLead({ open, onClose, onSave, editData }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        title: "",
        owner: "",
        status: "",
    });

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                title: "",
                owner: "",
                status: "",
            });
        }
    }, [editData, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={3}
                    sx={{ borderBottom: "1px solid #e2e8f0" }}
                >
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        {editData ? "Edit Lead" : "Create Lead"}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Email <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#fff",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                                        "&.Mui-focused fieldset": { borderColor: "#5B4DDB" },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon sx={{ color: "#94a3b8" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                First Name <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                    },
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Last Name <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                    },
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Phone Number <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={0.5}
                                                sx={{
                                                    cursor: "pointer",
                                                    paddingRight: "8px",
                                                    borderRight: "1px solid #e2e8f0",
                                                    marginRight: "8px",
                                                }}
                                            >
                                                <FlagIcon />
                                                <KeyboardArrowDownIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                            </Stack>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Job Title
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                    },
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Contact Owner
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="owner"
                                    value={form.owner}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={{
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                                    }}
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <span style={{ color: "#94a3b8" }}>Choose</span>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Choose
                                    </MenuItem>
                                    <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                                    <MenuItem value="Wade Warren">Wade Warren</MenuItem>
                                    <MenuItem value="Brooklyn Simmons">Brooklyn Simmons</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Lead Status
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={{
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                                    }}
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <span style={{ color: "#94a3b8" }}>Choose</span>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Choose
                                    </MenuItem>
                                    {STATUS.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={3}
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            width: "48%",
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            width: "48%",
                            backgroundColor: "#5B4DDB",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                            "&:hover": { backgroundColor: "#4f46e5" },
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
