import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiPost } from "../../services/api";
import {
    Box,
    Typography,
    Stack,
    Button,
    Grid,
    Paper,
    Tabs,
    Tab,
    TextField,
    IconButton,
    Divider,
    Avatar,
    Drawer,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Chip,
    Tooltip,
} from "@mui/material";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import NoteIcon from "@mui/icons-material/Note";
import EventIcon from "@mui/icons-material/Event";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CallIcon from "@mui/icons-material/Call";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircleIcon from "@mui/icons-material/Circle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { useLeads } from "../../context/LeadsContext";
import { useLeadActivities } from "../../context/LeadActivitiesContext";
import { toast } from "react-toastify";
import { COLORS } from "../../theme/constants";
import {
    CreateNoteDialog,
    CreateEmailDialog,
    LogCallDialog,
    CreateTaskDialog,
    ScheduleMeetingDialog,
    ConvertLeadDialog
} from "../../components/activities";
const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;
const BORDER = COLORS.BORDER;
const TAB_LABELS = ["Activity", "Notes", "Emails", "Calls", "Tasks", "Meetings"];
export default function LeadDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getLead, updateLead } = useLeads();
    const { getActivitiesByLead, getActivitiesByType, addActivity, refreshActivities, toggleTaskComplete, isOverdue } = useLeadActivities();
    const [activitySearch, setActivitySearch] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [callDialogOpen, setCallDialogOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);
    const lead = getLead(id);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        title: "",
        status: "",
    });
    useEffect(() => {
        if (lead) {
            setForm({
                firstName: lead.first_name || "",
                lastName: lead.last_name || "",
                email: lead.email || "",
                phone: lead.phone || "",
                title: lead.title || "",
                status: lead.status || "New",
            });
        }
    }, [lead]);
    const [allActivities, setAllActivities] = useState([]);
    useEffect(() => {
        const loadActivities = async () => {
            const result = await getActivitiesByLead(id);
            if (Array.isArray(result)) {
                setAllActivities(result);
            }
        };
        if (id) loadActivities();
    }, [id, getActivitiesByLead]);
    const getTabFilter = (activity) => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return activity.type === "note";
        if (activeTab === 2) return activity.type === "email";
        if (activeTab === 3) return activity.type === "call";
        if (activeTab === 4) return activity.type === "task";
        if (activeTab === 5) return activity.type === "meeting";
        return true;
    };
    const upcomingTasks = allActivities
        .filter(a => a.type === "task" && !a.completed)
        .filter(a => {
            const searchLower = activitySearch.toLowerCase();
            return a.title?.toLowerCase().includes(searchLower) ||
                a.content?.toLowerCase().includes(searchLower) ||
                a.assignedTo?.toLowerCase().includes(searchLower);
        })
        .filter(getTabFilter);
    const historyActivities = allActivities
        .filter(a => a.type !== "task" || a.completed)
        .filter(a => {
            const searchLower = activitySearch.toLowerCase();
            return a.title?.toLowerCase().includes(searchLower) ||
                a.content?.toLowerCase().includes(searchLower);
        })
        .filter(getTabFilter);
    const groupActivitiesByMonth = (activities) => {
        const groups = {};
        activities.forEach(activity => {
            const actDate = new Date(activity.dueDate || activity.date || activity.startDate || activity.createdAt);
            const monthYear = actDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(activity);
        });
        return groups;
    };
    const groupedHistory = groupActivitiesByMonth(historyActivities);
    const TAB_CONFIG = {
        1: { label: "Notes", btnLabel: "Create Note", open: () => setNoteDialogOpen(true) },
        2: { label: "Emails", btnLabel: "Create Email", open: () => setEmailDialogOpen(true) },
        3: { label: "Calls", btnLabel: "Log Call", open: () => setCallDialogOpen(true) },
        4: { label: "Tasks", btnLabel: "Create Task", open: () => setTaskDialogOpen(true) },
        5: { label: "Meetings", btnLabel: "Schedule Meeting", open: () => setMeetingDialogOpen(true) },
    };
    const handleConvert = () => {
        setConvertDialogOpen(true);
    };
    const handleConvertConfirm = async (newDeal) => {
        try {
            const res = await apiPost("/deals/", {
                name: newDeal.name,
                stage: newDeal.stage,
                close_date: newDeal.closeDate,
                owner: newDeal.owner,
                amount: newDeal.amount,
                priority: newDeal.priority,
            });
            if (res && res.ok) {
                const createdDeal = await res.json();
                updateLead(lead.id, { status: "Converted" });
                toast.success("Lead converted to Deal successfully!");
            } else {
                toast.error("Failed to create deal");
            }
        } catch (err) {
            console.error("Error converting lead:", err);
            toast.error("Error converting lead to deal");
        }
        setConvertDialogOpen(false);
    };
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handleSaveNote = async (noteData) => {
        await addActivity(id, noteData);
        const updated = await refreshActivities(id);
        if (Array.isArray(updated)) setAllActivities(updated);
        toast.success("Note added successfully!");
    };
    const handleSaveEmail = async (emailData) => {
        await addActivity(id, emailData);
        const updated = await refreshActivities(id);
        if (Array.isArray(updated)) setAllActivities(updated);
        toast.success("Email logged successfully!");
    };
    const handleSaveCall = async (callData) => {
        await addActivity(id, callData);
        const updated = await refreshActivities(id);
        if (Array.isArray(updated)) setAllActivities(updated);
        toast.success("Call logged successfully!");
    };
    const handleSaveTask = async (taskData) => {
        await addActivity(id, taskData);
        const updated = await refreshActivities(id);
        if (Array.isArray(updated)) setAllActivities(updated);
        toast.success("Task created successfully!");
    };
    const handleSaveMeeting = async (meetingData) => {
        await addActivity(id, meetingData);
        const updated = await refreshActivities(id);
        if (Array.isArray(updated)) setAllActivities(updated);
        toast.success("Meeting scheduled successfully!");
    };
    const handleTaskToggle = (taskId) => {
        toggleTaskComplete(taskId);
        toast.success("Task status updated!");
    };
    const handleSave = () => {
        if (!form.firstName || !form.lastName) {
            toast.error("Name is required");
            return;
        }
        updateLead(lead.id, {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            title: form.title,
            status: form.status,
        });
        setDrawerOpen(false);
    };
    const handleEditClick = () => {
        setDrawerOpen(true);
    };
    if (!lead) {
        return (
            <Box
                sx={{
                    padding: "24px",
                    marginTop: "87px",
                    marginLeft: "90px",
                    backgroundColor: BG,
                    minHeight: "calc(100vh - 87px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Sidebar />
                <TopNavbar />
                <Typography variant="h6" color="text.secondary">Lead not found</Typography>
            </Box>
        );
    }
    return (
        <Box
            sx={{
                padding: "24px",
                marginTop: "87px",
                marginLeft: "90px",
                backgroundColor: BG,
                minHeight: "calc(100vh - 87px)",
            }}
        >
            <Sidebar />
            <TopNavbar />
            <Box sx={{ maxWidth: "100%", margin: "0 auto", paddingLeft: 2, paddingRight: 2 }}>
                <Button
                    startIcon={<ArrowBackIosIcon />}
                    onClick={() => navigate("/leads")}
                    sx={{ color: "#64748b", textTransform: "none", mb: 2 }}
                >
                    Leads
                </Button>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "280px 1fr 300px" },
                        gap: 3,
                        alignItems: "flex-start"
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Paper sx={{ p: 3, borderRadius: "12px", height: "100%" }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: "#e2e8f0",
                                        color: "#64748b",
                                    }}
                                />
                                <Box sx={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
                                    <Typography variant="h6" fontWeight={700} color="#1e293b" noWrap>
                                        {lead.name}
                                    </Typography>
                                    <Typography variant="body2" color="#64748b">
                                        {lead.role}
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" color="#64748b" noWrap sx={{ lineHeight: 1 }}>
                                            {lead.email}
                                        </Typography>
                                        <ContentCopyIcon sx={{ fontSize: 14, color: "#94a3b8", cursor: "pointer", flexShrink: 0 }} />
                                    </Stack>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={4}>
                                <ActionBtn icon={<EditIcon fontSize="small" />} label="Note" onClick={() => setNoteDialogOpen(true)} />
                                <ActionBtn icon={<EmailIcon fontSize="small" />} label="Email" onClick={() => setEmailDialogOpen(true)} />
                                <ActionBtn icon={<CallIcon fontSize="small" />} label="Call" onClick={() => setCallDialogOpen(true)} />
                                <ActionBtn icon={<TaskAltIcon fontSize="small" />} label="Task" onClick={() => setTaskDialogOpen(true)} />
                                <ActionBtn icon={<EventIcon fontSize="small" />} label="Meet..." onClick={() => setMeetingDialogOpen(true)} />
                            </Stack>
                            <Divider sx={{ mb: 3 }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1" fontWeight={600} color="#1e293b">
                                    About this lead
                                </Typography>
                                <IconButton size="small" onClick={handleEditClick}>
                                    <EditIcon fontSize="small" sx={{ color: PRIMARY }} />
                                </IconButton>
                            </Stack>
                            <Stack spacing={2.5}>
                                <InfoItem label="Email" value={lead.email} />
                                <InfoItem label="First Name" value={lead.firstName} />
                                <InfoItem label="Last Name" value={lead.lastName} />
                                <InfoItem label="Phone number" value={lead.phone} />
                                <InfoItem label="Lead Status" value={lead.status} />
                                <InfoItem label="Job Title" value={lead.title} />
                                <InfoItem label="Created Date" value={lead.created} />
                            </Stack>
                        </Paper>
                    </Box>
                    <Box sx={{ minWidth: 0, pt: 1 }}>
                        <Stack direction="row" spacing={2} mb={3}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search activities"
                                value={activitySearch}
                                onChange={(e) => setActivitySearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
                                }}
                                sx={{ bgcolor: "#fff", "& fieldset": { borderRadius: "10px" } }}
                            />
                            <Tooltip title={lead?.status !== "Qualified" ? "Only Qualified leads can be converted" : ""}>
                                <span>
                                    <Button
                                        variant="contained"
                                        onClick={handleConvert}
                                        disabled={lead?.status !== "Qualified" || lead?.status === "Converted"}
                                        sx={{
                                            bgcolor: PRIMARY,
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            px: 3,
                                            "&:hover": { bgcolor: "#4f46e5" },
                                            "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" }
                                        }}
                                    >
                                        {lead?.status === "Converted" ? "Converted" : "Convert"}
                                    </Button>
                                </span>
                            </Tooltip>
                        </Stack>
                        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="activity tabs">
                                {TAB_LABELS.map((label, idx) => (
                                    <Tab key={idx} label={label} sx={{ textTransform: "none", fontWeight: 500 }} />
                                ))}
                            </Tabs>
                        </Box>
                        {activeTab > 0 && TAB_CONFIG[activeTab] && (
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                                    {TAB_CONFIG[activeTab].label}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={TAB_CONFIG[activeTab].open}
                                    sx={{
                                        bgcolor: PRIMARY,
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2,
                                        "&:hover": { bgcolor: "#4f46e5" }
                                    }}
                                >
                                    {TAB_CONFIG[activeTab].btnLabel}
                                </Button>
                            </Stack>
                        )}
                        <Stack spacing={1}>
                            {upcomingTasks.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} color="#1e293b" mb={2}>
                                        Upcoming
                                    </Typography>
                                    <Stack spacing={2}>
                                        {upcomingTasks.map(task => (
                                            <ActivityCard
                                                key={task.id}
                                                data={task}
                                                isOverdue={isOverdue(task)}
                                                onToggle={() => handleTaskToggle(task.id)}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                            {Object.entries(groupedHistory).map(([monthLabel, items]) => (
                                <Box key={monthLabel}>
                                    <Typography variant="subtitle1" fontWeight={700} color="#1e293b" mb={2}>
                                        {monthLabel}
                                    </Typography>
                                    <Stack spacing={2}>
                                        {items.map(activity => (
                                            <ActivityCard key={activity.id} data={activity} />
                                        ))}
                                    </Stack>
                                </Box>
                            ))}
                            {upcomingTasks.length === 0 && historyActivities.length === 0 && (
                                <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary">No activities found.</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: "12px",
                                border: `1px solid ${PRIMARY}`,
                                backgroundColor: "#fff",
                                mb: 3
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <SmartToyIcon sx={{ color: PRIMARY }} />
                                <Typography variant="subtitle1" fontWeight={700} color={PRIMARY}>
                                    AI Lead Summary
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="#1e293b" lineHeight={1.6}>
                                There are no activities associated with this lead and further details are needed to provide a comprehensive summary.
                            </Typography>
                        </Paper>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <KeyboardArrowDownIcon sx={{ color: PRIMARY }} />
                                <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                    Attachments
                                </Typography>
                            </Stack>
                            <Button
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "none", color: PRIMARY, fontWeight: 600 }}
                            >
                                Add
                            </Button>
                        </Stack>
                        <Typography variant="caption" color="#64748b">
                            See the files attached to your activities or uploaded to this record.
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 450, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        px={3}
                        py={2.5}
                        sx={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                            Edit Lead
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Box px={3} py={3} sx={{ flex: 1, overflowY: "auto" }}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={form.status}
                                    label="Status"
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    sx={{ borderRadius: "10px" }}
                                >
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Open">Open</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Qualified">Qualified</MenuItem>
                                    <MenuItem value="Lost">Lost</MenuItem>
                                    <MenuItem value="Bad Info">Bad Info</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>
                    <Box p={3} sx={{ borderTop: `1px solid ${BORDER}` }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    borderRadius: "10px",
                                    color: "#64748b",
                                    borderColor: BORDER,
                                    textTransform: "none"
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                sx={{
                                    borderRadius: "10px",
                                    bgcolor: PRIMARY,
                                    textTransform: "none",
                                    "&:hover": { bgcolor: "#4f46e5" }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Drawer>
            <CreateNoteDialog
                open={noteDialogOpen}
                onClose={() => setNoteDialogOpen(false)}
                onSave={handleSaveNote}
                leadName={lead?.name}
            />
            <CreateEmailDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
                onSave={handleSaveEmail}
                leadEmail={lead?.email}
            />
            <LogCallDialog
                open={callDialogOpen}
                onClose={() => setCallDialogOpen(false)}
                onSave={handleSaveCall}
                leadName={lead?.name}
            />
            <CreateTaskDialog
                open={taskDialogOpen}
                onClose={() => setTaskDialogOpen(false)}
                onSave={handleSaveTask}
            />
            <ScheduleMeetingDialog
                open={meetingDialogOpen}
                onClose={() => setMeetingDialogOpen(false)}
                onSave={handleSaveMeeting}
                leadName={lead?.name}
            />
            <ConvertLeadDialog
                open={convertDialogOpen}
                onClose={() => setConvertDialogOpen(false)}
                lead={lead}
                onConvert={handleConvertConfirm}
            />
        </Box>
    );
}
function ActionBtn({ icon, label, onClick }) {
    return (
        <Stack alignItems="center" spacing={0.5}>
            <IconButton
                onClick={onClick}
                sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    width: 40,
                    height: 40,
                    color: "#64748b",
                    "&:hover": { borderColor: PRIMARY, color: PRIMARY, bgcolor: "#e0e7ff" }
                }}
            >
                {icon}
            </IconButton>
            <Typography variant="caption" color="#64748b">{label}</Typography>
        </Stack>
    )
}
function InfoItem({ label, value }) {
    return (
        <Box>
            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>
                {label}
            </Typography>
            <Typography variant="body2" color="#1e293b" fontWeight={500}>
                {value}
            </Typography>
        </Box>
    )
}
function ActivityCard({ data, isOverdue, onToggle }) {
    const [expanded, setExpanded] = useState(false);
    const isCall = data.type === "call";
    const isMeeting = data.type === "meeting";
    const isEmail = data.type === "email";
    const isNote = data.type === "note";
    const isTask = data.type === "task";
    const bodyText = data.content || data.description || "";
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }) + ' at ' + d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5}>
                {isTask ? (
                    <Checkbox
                        size="small"
                        checked={data.completed || false}
                        onChange={onToggle}
                        sx={{
                            p: 0,
                            '& .MuiSvgIcon-root': {
                                borderRadius: '50%',
                            },
                            '&.Mui-checked': {
                                color: '#10b981',
                            },
                            '&:not(.Mui-checked)': {
                                color: isOverdue ? '#dc2626' : '#94a3b8',
                            }
                        }}
                        icon={<CircleIcon sx={{ fontSize: 20, opacity: 0.3 }} />}
                        checkedIcon={<CircleIcon sx={{ fontSize: 20 }} />}
                    />
                ) : (
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ p: 0 }}
                    >
                        <KeyboardArrowDownIcon
                            fontSize="small"
                            sx={{
                                color: PRIMARY,
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        />
                    </IconButton>
                )}
                {isTask ? (
                    <Stack direction="row" alignItems="center" spacing={1} flex={1}>
                        <Typography variant="body2" fontWeight={600} color="#1e293b">
                            Task
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            assigned to {data.assignedTo}
                        </Typography>
                    </Stack>
                ) : (
                    <Typography variant="body2" fontWeight={600} color="#1e293b" flex={1}>
                        {data.title}
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    color={isOverdue ? "#dc2626" : "#64748b"}
                    fontWeight={isOverdue ? 600 : 400}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {isOverdue && (
                        <Box component="span" sx={{ color: "#dc2626", fontWeight: 600, mr: 0.5 }}>
                            Overdue:
                        </Box>
                    )}
                    {formatDate(data.dueDate || data.date || data.startDate || data.createdAt)}
                </Typography>
            </Stack>
            {isTask && (
                <Typography variant="body2" color="primary" sx={{ ml: 4.5, mt: 0.5, textDecoration: data.completed ? 'line-through' : 'none' }}>
                    {data.title}
                </Typography>
            )}
            {!isTask && expanded && bodyText && (
                <Typography variant="body2" color="#64748b" sx={{ ml: 4.5, mt: 0.5 }}>
                    {bodyText}
                </Typography>
            )}
        </Paper>
    )
}
function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}