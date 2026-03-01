import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import { useNotifications } from "../../context/NotificationContext";
import { toast } from "react-toastify";
import { apiGet, apiPut } from "../../services/api";
import { COLORS } from "../../theme/constants";
import { ActivitySection } from "../../components/activities";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button,
    Card,
    Divider,
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
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;

const STAGES = [
    "Appointment Scheduled",
    "Qualified to Buy",
    "Presentation Scheduled",
    "Decision Maker Bought In",
    "Contract Sent",
    "Closed Won",
    "Closed Lost",
];

export default function DealDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    const [dialogsOpen, setDialogsOpen] = useState({
        note: false, email: false, call: false, task: false, meeting: false
    });

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const res = await apiGet(`/deals/${id}/`);
                if (res && res.ok) {
                    const data = await res.json();
                    setDeal(data);
                } else {
                    toast.error("Deal not found");
                    navigate("/deals");
                }
            } catch (err) {
                console.error("Error fetching deal:", err);
                toast.error("Error loading deal");
                navigate("/deals");
            }
            setLoading(false);
        };
        fetchDeal();
    }, [id, navigate]);

    const handleStageChange = async (event) => {
        const newStage = event.target.value;
        const updatedDeal = { ...deal, stage: newStage };
        setDeal(updatedDeal);

        try {
            await apiPut(`/deals/${deal.id}/`, { ...deal, stage: newStage, close_date: deal.closeDate || deal.close_date });
        } catch (err) {
            console.error("Error updating deal stage:", err);
        }

        toast.success(`Stage updated to ${newStage}`);
        addNotification({
            type: "update",
            title: "Deal Stage Updated",
            message: `${deal.name} moved to ${newStage}`
        });
    };

    const handleActionClick = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: true }));
    };

    const handleDialogClose = (type) => {
        setDialogsOpen(prev => ({ ...prev, [type]: false }));
    };

    const handleEditSave = async (updatedData) => {
        const newDeal = { ...deal, ...updatedData };
        setDeal(newDeal);

        try {
            await apiPut(`/deals/${deal.id}/`, { ...newDeal, close_date: newDeal.closeDate || newDeal.close_date });
        } catch (err) {
            console.error("Error updating deal:", err);
        }

        setEditOpen(false);
        toast.success("Deal updated successfully");
    };

    if (loading || !deal) return <Box p={4}>Loading...</Box>;

    return (
        <Box sx={{ marginTop: "87px", marginLeft: "90px", minHeight: "calc(100vh - 87px)", display: "flex", flexDirection: "column" }}>
            <Sidebar />
            <TopNavbar />

            <Box sx={{ display: "flex", flex: 1 }}>


                <Box sx={{ width: "320px", borderRight: "1px solid #e2e8f0", bgcolor: "#fff", p: 3 }}>

                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        onClick={() => navigate("/deals")}
                        sx={{ color: "#64748b", textTransform: "none", fontSize: "14px", p: 0, minWidth: "auto", mb: 2, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                    >
                        Deals
                    </Button>


                    <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.3, mb: 1 }}>
                        {deal.name}
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="#1e293b" sx={{ mb: 0.5 }}>
                        Amount : ${Number(deal.amount).toLocaleString()}
                    </Typography>


                    <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
                        <Typography variant="body2" color="#64748b">Stage :</Typography>
                        <Select
                            variant="standard"
                            disableUnderline
                            value={deal.stage}
                            onChange={handleStageChange}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                                color: PRIMARY,
                                fontWeight: 500,
                                fontSize: "14px",
                                "& .MuiSelect-select": { py: 0, paddingRight: "24px !important" },
                                "& .MuiSvgIcon-root": { color: PRIMARY, fontSize: 18 }
                            }}
                        >
                            {STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                    </Stack>


                    <Stack direction="row" spacing={1.5} mb={4}>
                        {[
                            { label: "Note", icon: <NotesIcon fontSize="small" />, type: "note" },
                            { label: "Email", icon: <EmailOutlinedIcon fontSize="small" />, type: "email" },
                            { label: "Call", icon: <CallOutlinedIcon fontSize="small" />, type: "call" },
                            { label: "Task", icon: <TaskAltOutlinedIcon fontSize="small" />, type: "task" },
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
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">About this Deal</Typography>
                        </Stack>
                        <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => setEditOpen(true)}>
                            <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Stack>

                    <Stack spacing={2.5} pl={1}>
                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Deal Owner</Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: "#f1f5f9", color: "#64748b" }}>{deal.owner.charAt(0)}</Avatar>
                                <Typography variant="body2" fontWeight={600} color="#1e293b">{deal.owner}</Typography>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Priority</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">{deal.priority || "High"}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Created Date</Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b">
                                {new Date(deal.created || Date.now()).toLocaleString()}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>


                <Box sx={{ flex: 1, bgcolor: "#fff", p: 3, borderRight: "1px solid #e2e8f0" }}>
                    <ActivitySection
                        entityId={id}
                        entityType="deals"
                        entityName={deal.name}
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
                            <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>AI Deal Summary</Typography>
                        </Stack>
                        <Typography variant="body2" color="#1e293b" fontSize="13px" lineHeight={1.5}>
                            There are no activities associated with this lead and further details are needed to provide a comprehensive summary.
                        </Typography>
                    </Card>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">Attachments</Typography>
                        </Stack>
                        <Button size="small" sx={{ textTransform: "none", color: PRIMARY, fontWeight: 600 }} onClick={() => toast.info("Attachment uploaded")}>+ Add</Button>
                    </Stack>
                    <Typography variant="caption" color="#94a3b8" sx={{ pl: 3.5, display: "block" }}>
                        See the files attached to your activities or uploaded to this record.
                    </Typography>
                </Box>

            </Box>





            <Drawer anchor="right" open={editOpen} onClose={() => setEditOpen(false)}>
                <Box p={4} width={450}>
                    <Typography variant="h6" fontWeight={700} mb={3}>Edit Deal</Typography>
                    <Stack spacing={3}>
                        <TextField
                            label="Deal Name"
                            fullWidth
                            value={deal.name}
                            onChange={(e) => setDeal({ ...deal, name: e.target.value })}
                        />
                        <TextField
                            label="Amount"
                            type="number"
                            fullWidth
                            value={deal.amount}
                            onChange={(e) => setDeal({ ...deal, amount: e.target.value })}
                        />
                        <TextField
                            select
                            label="Stage"
                            value={deal.stage}
                            onChange={(e) => setDeal({ ...deal, stage: e.target.value })}
                        >
                            {STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>

                        <TextField
                            label="Owner"
                            fullWidth
                            value={deal.owner}
                            onChange={(e) => setDeal({ ...deal, owner: e.target.value })}
                        />

                        <TextField
                            select
                            label="Priority"
                            value={deal.priority}
                            onChange={(e) => setDeal({ ...deal, priority: e.target.value })}
                        >
                            {["Low", "Medium", "High", "Critical"].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </TextField>

                        <Button variant="contained" size="large" onClick={() => handleEditSave(deal)} sx={{ bgcolor: PRIMARY }}>
                            Save Changes
                        </Button>
                    </Stack>
                </Box>
            </Drawer>

        </Box>
    );
}
