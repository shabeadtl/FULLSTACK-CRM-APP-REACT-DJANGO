import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNotifications } from "../../context/NotificationContext";
import { ActivitySection } from "../../components/activities";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button,
    Card,
    Divider,
    Chip,
    Avatar,
    TextField,
    MenuItem,
    Select,
    Drawer,
    CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import { getCompanyById, updateCompany, deleteCompany } from "../../services/companyService";
import { COLORS } from "../../theme/constants";


const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];


const getStatusColor = (status) => {
    switch (status) {
        case "Active": return { bg: "#d1fae5", color: "#059669" };
        case "Inactive": return { bg: "#fee2e2", color: "#dc2626" };
        case "Pending": return { bg: "#fef3c7", color: "#d97706" };
        default: return { bg: "#f3f4f6", color: "#6b7280" };
    }
};


const getInitials = (name) => {
    if (!name) return "C";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export default function CompanyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    const [dialogsOpen, setDialogsOpen] = useState({
        note: false, email: false, call: false, task: false, meeting: false
    });

    useEffect(() => {
        loadCompany();
    }, [id]);

    const loadCompany = async () => {
        setLoading(true);
        const foundCompany = await getCompanyById(id);
        if (foundCompany) {
            setCompany(foundCompany);
        } else {
            toast.error("Company not found");
            navigate("/companies");
        }
        setLoading(false);
    };

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        const updatedCompany = { ...company, status: newStatus };
        setCompany(updatedCompany);


        await updateCompany(id, { status: newStatus });

        toast.success(`Status updated to ${newStatus}`);
        addNotification({
            type: "update",
            title: "Company Status Updated",
            message: `${company.name} moved to ${newStatus}`
        });
    };

    const handleActionClick = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: true }));
    };

    const handleDialogClose = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: false }));
    };

    const handleEditSave = async (updatedData) => {
        const newCompany = { ...company, ...updatedData };
        setCompany(newCompany);

        await updateCompany(id, updatedData);

        setEditOpen(false);
        toast.success("Company updated successfully");
        addNotification({
            type: "update",
            title: "Company Updated",
            message: newCompany.name
        });
    };

    const handleDelete = async () => {
        await deleteCompany(id);
        toast.success("Company deleted successfully");
        addNotification({
            type: "delete",
            title: "Company Deleted",
            message: company.name
        });
        navigate("/companies");
    };

    if (loading) {
        return (
            <Box sx={{ marginTop: { xs: "70px", md: "87px" }, marginLeft: { xs: 0, md: "90px" }, minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sidebar />
                <TopNavbar />
                <CircularProgress />
            </Box>
        );
    }

    if (!company) {
        return (
            <Box sx={{ marginTop: { xs: "70px", md: "87px" }, marginLeft: { xs: 0, md: "90px" }, minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sidebar />
                <TopNavbar />
                <Typography>Company not found</Typography>
            </Box>
        );
    }

    const statusStyle = getStatusColor(company.status);

    return (
        <Box sx={{ marginTop: { xs: "70px", md: "87px" }, marginLeft: { xs: 0, md: "90px" }, minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" }, display: "flex", flexDirection: "column" }}>
            <Sidebar />
            <TopNavbar />

            <Box sx={{ display: "flex", flex: 1, flexDirection: { xs: "column", lg: "row" } }}>


                <Box sx={{ width: { xs: "100%", lg: "320px" }, borderRight: { xs: "none", lg: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", lg: "none" }, bgcolor: "#fff", p: { xs: 2, md: 3 } }}>

                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        onClick={() => navigate("/companies")}
                        sx={{ color: "#64748b", textTransform: "none", fontSize: "14px", p: 0, minWidth: "auto", mb: 2, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                    >
                        Companies
                    </Button>


                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: PRIMARY, fontSize: 20, fontWeight: 600 }}>
                            {getInitials(company.name)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.3 }}>
                                {company.name}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                {company.industry || "No industry"}
                            </Typography>
                        </Box>
                    </Box>


                    <Stack direction="row" spacing={1} mb={2}>
                        <Chip
                            label={company.status || "Active"}
                            size="small"
                            sx={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: "12px",
                                borderRadius: "6px",
                            }}
                        />
                    </Stack>


                    <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
                        <Typography variant="body2" color="#64748b">Status :</Typography>
                        <Select
                            variant="standard"
                            disableUnderline
                            value={company.status || "Active"}
                            onChange={handleStatusChange}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                                color: PRIMARY,
                                fontWeight: 500,
                                fontSize: "14px",
                                "& .MuiSelect-select": { py: 0, paddingRight: "24px !important" },
                                "& .MuiSvgIcon-root": { color: PRIMARY, fontSize: 18 }
                            }}
                        >
                            {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                    </Stack>


                    <Stack direction="row" spacing={1.5} mb={4}>
                        {[
                            { label: "Note", icon: <DescriptionOutlinedIcon fontSize="small" />, type: "note" },
                            { label: "Email", icon: <EmailOutlinedIcon fontSize="small" />, type: "email" },
                            { label: "Call", icon: <CallOutlinedIcon fontSize="small" />, type: "call" },
                            { label: "Task", icon: <AssignmentOutlinedIcon fontSize="small" />, type: "task" },
                            { label: "Meeting", icon: <EventOutlinedIcon fontSize="small" />, type: "meeting" }
                        ].map((action, i) => (
                            <Stack
                                key={i}
                                alignItems="center"
                                spacing={1}
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleActionClick(action.type)}
                            >
                                <Box sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: "10px",
                                    bgcolor: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: PRIMARY,
                                    transition: "all 0.2s",
                                    "&:hover": { borderColor: PRIMARY, bgcolor: "#e0e7ff" }
                                }}>
                                    {action.icon}
                                </Box>
                                <Typography variant="caption" color="#64748b" fontSize="11px">{action.label}</Typography>
                            </Stack>
                        ))}
                    </Stack>

                    <Divider sx={{ mb: 3 }} />


                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <KeyboardArrowDownIcon fontSize="small" sx={{ color: PRIMARY }} />
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">About this Company</Typography>
                        </Stack>
                        <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => setEditOpen(true)}>
                            <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Stack>

                    <Stack spacing={2.5} pl={1}>
                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Email</Typography>
                            <Typography variant="body2" color="#1e293b">
                                {company.email || "No email"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Phone</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{company.phone || "No phone"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Contact Person</Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: "#f1f5f9", color: "#64748b" }}>{company.contact?.charAt(0) || "?"}</Avatar>
                                <Typography variant="body2" fontWeight={600} color="#1e293b">{company.contact || "Unassigned"}</Typography>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Location</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{company.location || "Not specified"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Industry</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{company.industry || "Not specified"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Created Date</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">
                                {company.createdAt ? new Date(company.createdAt).toLocaleString() : "Unknown"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>


                <Box sx={{ flex: 1, bgcolor: "#fff", p: 3, borderRight: "1px solid #e2e8f0" }}>
                    <ActivitySection
                        entityId={id}
                        entityType="companies"
                        entityName={company.name}
                        entityEmail={company.email || ""}
                        dialogsOpen={dialogsOpen}
                        onDialogClose={handleDialogClose}
                        onDialogOpen={handleActionClick}
                    />
                </Box>


                <Box sx={{ width: "350px", bgcolor: "#fff", p: 3 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: "12px",
                            borderColor: "#818cf8",
                            bgcolor: "#fff",
                            mb: 4
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                            <Box sx={{ display: "flex", p: 0.5, bgcolor: "#e0e7ff", borderRadius: "6px" }}>
                                <AutoAwesomeIcon sx={{ color: PRIMARY, fontSize: 16 }} />
                            </Box>
                            <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>AI Company Summary</Typography>
                        </Stack>
                        <Typography variant="body2" color="#1e293b" fontSize="13px" lineHeight={1.5}>
                            {company.name} is a {company.industry || "company"} located in {company.location || "an unspecified location"}.
                            It is currently in "{company.status}" status.
                            {company.contact && ` Primary contact: ${company.contact}.`}
                        </Typography>
                    </Card>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">Attachments</Typography>
                        </Stack>
                        <Button size="small" sx={{ textTransform: "none", color: PRIMARY, fontWeight: 600 }} onClick={() => toast.info("Attachment feature coming soon")}>+ Add</Button>
                    </Stack>
                    <Typography variant="caption" color="#94a3b8" sx={{ pl: 3.5, display: "block" }}>
                        See the files attached to your activities or uploaded to this record.
                    </Typography>
                </Box>

            </Box>





            <Drawer anchor="right" open={editOpen} onClose={() => setEditOpen(false)}>
                <Box p={4} width={450}>
                    <Typography variant="h6" fontWeight={700} mb={3}>Edit Company</Typography>
                    <Stack spacing={3}>
                        <TextField
                            label="Company Name"
                            fullWidth
                            value={company.name}
                            onChange={(e) => setCompany({ ...company, name: e.target.value })}
                        />
                        <TextField
                            label="Industry"
                            fullWidth
                            value={company.industry || ""}
                            onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={company.email || ""}
                            onChange={(e) => setCompany({ ...company, email: e.target.value })}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={company.phone || ""}
                            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                        />
                        <TextField
                            label="Location"
                            fullWidth
                            value={company.location || ""}
                            onChange={(e) => setCompany({ ...company, location: e.target.value })}
                        />
                        <TextField
                            label="Contact Person"
                            fullWidth
                            value={company.contact || ""}
                            onChange={(e) => setCompany({ ...company, contact: e.target.value })}
                        />
                        <TextField
                            select
                            label="Status"
                            value={company.status || "Active"}
                            onChange={(e) => setCompany({ ...company, status: e.target.value })}
                        >
                            {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>

                        <Button variant="contained" size="large" onClick={() => handleEditSave(company)} sx={{ bgcolor: PRIMARY }}>
                            Save Changes
                        </Button>
                    </Stack>
                </Box>
            </Drawer>

        </Box>
    );
}
