import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import { useNotifications } from "../../context/NotificationContext";
import { toast } from "react-toastify";
import { apiGet, apiPut } from "../../services/api";
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
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import { COLORS, getPriorityColor, getStatusColor } from "../../theme/constants";


const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;

const STATUS = ["New", "Waiting on us", "Waiting on contact", "Closed"];
const PRIORITY = ["Low", "Medium", "High", "Critical"];
const SOURCE = ["Chat", "Email", "Phone"];

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    const [dialogsOpen, setDialogsOpen] = useState({
        note: false, email: false, call: false, task: false, meeting: false
    });

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await apiGet(`/tickets/${id}/`);
                if (res && res.ok) {
                    const data = await res.json();
                    const normalizedTicket = {
                        ...data,
                        owner: Array.isArray(data.owner)
                            ? data.owner.join(", ")
                            : (data.owner || "")
                    };
                    setTicket(normalizedTicket);
                } else {
                    toast.error("Ticket not found");
                    navigate("/Tickets");
                }
            } catch (err) {
                console.error("Error fetching ticket:", err);
                toast.error("Error loading ticket");
                navigate("/Tickets");
            }
            setLoading(false);
        };
        fetchTicket();
    }, [id, navigate]);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        const updatedTicket = { ...ticket, status: newStatus };
        setTicket(updatedTicket);

        try {
            await apiPut(`/tickets/${ticket.id}/`, { ...ticket, status: newStatus });
        } catch (err) {
            console.error("Error updating ticket status:", err);
        }

        toast.success(`Status updated to ${newStatus}`);
        addNotification({
            type: "update",
            title: "Ticket Status Updated",
            message: `${ticket.name} moved to ${newStatus}`
        });
    };

    const handleActionClick = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: true }));
    };

    const handleDialogClose = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: false }));
    };

    const handleEditSave = async (updatedData) => {
        const newTicket = { ...ticket, ...updatedData };
        setTicket(newTicket);

        try {
            await apiPut(`/tickets/${ticket.id}/`, newTicket);
        } catch (err) {
            console.error("Error updating ticket:", err);
        }

        setEditOpen(false);
        toast.success("Ticket updated successfully");
        addNotification({
            type: "update",
            title: "Ticket Updated",
            message: newTicket.name
        });
    };

    if (loading || !ticket) return <Box p={4}>Loading...</Box>;

    const priorityStyle = getPriorityColor(ticket.priority);
    const statusStyle = getStatusColor(ticket.status, "ticket");

    return (
        <Box sx={{ marginTop: "87px", marginLeft: "90px", minHeight: "calc(100vh - 87px)", display: "flex", flexDirection: "column" }}>
            <Sidebar />
            <TopNavbar />

            <Box sx={{ display: "flex", flex: 1 }}>
                <Box sx={{ width: "320px", borderRight: "1px solid #e2e8f0", bgcolor: "#fff", p: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        onClick={() => navigate("/Tickets")}
                        sx={{ color: "#64748b", textTransform: "none", fontSize: "14px", p: 0, minWidth: "auto", mb: 2, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                    >
                        Tickets
                    </Button>

                    <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.3, mb: 1 }}>
                        {ticket.name}
                    </Typography>
                    <Stack direction="row" spacing={1} mb={2}>
                        <Chip
                            label={ticket.status}
                            size="small"
                            sx={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: "12px",
                                borderRadius: "6px",
                            }}
                        />
                        <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                                backgroundColor: priorityStyle.bg,
                                color: priorityStyle.color,
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
                            value={ticket.status}
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
                            {STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">About this Ticket</Typography>
                        </Stack>
                        <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => setEditOpen(true)}>
                            <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Stack>

                    <Stack spacing={2.5} pl={1}>
                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Description</Typography>
                            <Typography variant="body2" color="#1e293b">
                                {ticket.description || "No description provided"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Ticket Owner</Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: "#f1f5f9", color: "#64748b" }}>{ticket.owner?.charAt(0) || "?"}</Avatar>
                                <Typography variant="body2" fontWeight={600} color="#1e293b">{ticket.owner || "Unassigned"}</Typography>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="caption" color={PRIMARY} display="block" mb={0.5} fontWeight={500}>Priority</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{ticket.priority || "Not set"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Source</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{ticket.source || "Not specified"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Created Date</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">
                                {ticket.created ? new Date(ticket.created).toLocaleString() : "Unknown"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{ flex: 1, bgcolor: "#fff", p: 3, borderRight: "1px solid #e2e8f0" }}>
                    <ActivitySection
                        entityId={id}
                        entityType="tickets"
                        entityName={ticket.name}
                        entityEmail=""
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
                            <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>AI Ticket Summary</Typography>
                        </Stack>
                        <Typography variant="body2" color="#1e293b" fontSize="13px" lineHeight={1.5}>
                            The ticket titled "{ticket.name}" currently has {ticket.description ? "a description available" : "no description"}.
                            It is currently in "{ticket.status}" status with "{ticket.priority}" priority.
                            {ticket.source && ` Source: ${ticket.source}.`}
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
                    <Typography variant="h6" fontWeight={700} mb={3}>Edit Ticket</Typography>
                    <Stack spacing={3}>
                        <TextField
                            label="Ticket Name"
                            fullWidth
                            value={ticket.name}
                            onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={ticket.description || ""}
                            onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                        />
                        <TextField
                            select
                            label="Status"
                            value={ticket.status}
                            onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
                        >
                            {STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>

                        <TextField
                            select
                            label="Priority"
                            value={ticket.priority}
                            onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                        >
                            {PRIORITY.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </TextField>

                        <TextField
                            select
                            label="Source"
                            value={ticket.source || ""}
                            onChange={(e) => setTicket({ ...ticket, source: e.target.value })}
                        >
                            {SOURCE.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>

                        <TextField
                            label="Owner"
                            fullWidth
                            value={ticket.owner || ""}
                            onChange={(e) => setTicket({ ...ticket, owner: e.target.value })}
                        />

                        <Button variant="contained" size="large" onClick={() => handleEditSave(ticket)} sx={{ bgcolor: PRIMARY }}>
                            Save Changes
                        </Button>
                    </Stack>
                </Box>
            </Drawer>

        </Box>
    );
}
