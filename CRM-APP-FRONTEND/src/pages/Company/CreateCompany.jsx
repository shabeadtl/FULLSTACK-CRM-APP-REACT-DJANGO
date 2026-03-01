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
import BusinessIcon from "@mui/icons-material/Business";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];


const FlagIcon = () => (
    <img
        src="https://flagcdn.com/w20/in.png"
        srcSet="https://flagcdn.com/w40/in.png 2x"
        width="24"
        alt="India"
        style={{ borderRadius: "2px" }}
    />
);

export default function CreateCompany({ open, onClose, onSave, editData }) {
    const [form, setForm] = useState({
        name: "",
        industry: "",
        contact: "",
        email: "",
        phone: "",
        location: "",
        employees: "",
        revenue: "",
        status: "Active",
        website: "",
        description: "",
    });

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({
                name: "",
                industry: "",
                contact: "",
                email: "",
                phone: "",
                location: "",
                employees: "",
                revenue: "",
                status: "Active",
                website: "",
                description: "",
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
                        {editData ? "Edit Company" : "Create Company"}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Company Name <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="name"
                                value={form.name}
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
                                            <BusinessIcon sx={{ color: "#94a3b8" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Industry <span style={{ color: "#ef4444" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="industry"
                                value={form.industry}
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
                                Contact Person
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="contact"
                                value={form.contact}
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
                                        "& fieldset": { borderColor: "#e2e8f0" },
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
                                Location
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter"
                                name="location"
                                value={form.location}
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
                                Employees
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="e.g. 50-100"
                                name="employees"
                                value={form.employees}
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
                                Revenue
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="e.g. $5M - $10M"
                                name="revenue"
                                value={form.revenue}
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
                                Status
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
                                    {STATUS_OPTIONS.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                                Website
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="www.example.com"
                                name="website"
                                value={form.website}
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
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Brief description of the company..."
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "#e2e8f0" },
                                    },
                                }}
                            />
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
