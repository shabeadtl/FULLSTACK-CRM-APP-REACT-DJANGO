import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Stack,
    TextField,
    Tabs,
    Tab,
    Paper,
    Checkbox,
    Chip,
    Button,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet, apiPost, apiPatch } from "../../services/api";
import { toast } from "react-toastify";
import { COLORS } from "../../theme/constants";
import CreateNoteDialog from "./CreateNoteDialog";
import CreateEmailDialog from "./CreateEmailDialog";
import LogCallDialog from "./LogCallDialog";
import CreateTaskDialog from "./CreateTaskDialog";
import ScheduleMeetingDialog from "./ScheduleMeetingDialog";
const PRIMARY = COLORS.PRIMARY;
const TAB_LABELS = ["Activity", "Notes", "Emails", "Calls", "Tasks", "Meetings"];
export default function ActivitySection({
    entityId,
    entityType,
    entityName,
    entityEmail,
    dialogsOpen,
    onDialogClose,
    onDialogOpen,
}) {
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [activitySearch, setActivitySearch] = useState("");
    const apiBase = `/${entityType}/${entityId}/activities/`;
    const fetchActivities = useCallback(async () => {
        try {
            const res = await apiGet(apiBase);
            if (res && res.ok) {
                const data = await res.json();
                const parsed = data.map(a => ({
                    ...a,
                    date: a.date ? new Date(a.date) : null,
                    dueDate: a.due_date ? new Date(a.due_date) : null,
                    startDate: a.start_date ? new Date(a.start_date) : null,
                    createdAt: a.created_at ? new Date(a.created_at) : new Date(),
                    createdBy: a.created_by || "You",
                }));
                setActivities(parsed);
            }
        } catch (err) {
            console.error("Error fetching activities:", err);
        }
    }, [apiBase]);
    useEffect(() => {
        if (entityId) fetchActivities();
    }, [entityId, fetchActivities]);
    const addActivity = async (activityData) => {
        try {
            const payload = {
                type: activityData.type,
                title: activityData.title,
                description: activityData.description || activityData.content || "",
                date: activityData.date ? activityData.date.toISOString() : null,
                due_date: activityData.dueDate ? activityData.dueDate.toISOString() : null,
                start_date: activityData.startDate ? activityData.startDate.toISOString() : null,
                completed: activityData.completed || false,
                created_by: activityData.createdBy || "You",
            };
            const res = await apiPost(apiBase, payload);
            if (res && res.ok) {
                await fetchActivities();
            }
        } catch (err) {
            console.error("Error adding activity:", err);
        }
    };
    const handleTaskToggle = async (activityId) => {
        try {
            const res = await apiPatch(`${apiBase}${activityId}/toggle/`);
            if (res && res.ok) {
                const data = await res.json();
                setActivities(prev =>
                    prev.map(a =>
                        a.id === activityId ? { ...a, completed: data.completed } : a
                    )
                );
                toast.success("Task status updated!");
            }
        } catch (err) {
            console.error("Error toggling activity:", err);
        }
    };
    const getTabFilter = (activity) => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return activity.type === "note";
        if (activeTab === 2) return activity.type === "email";
        if (activeTab === 3) return activity.type === "call";
        if (activeTab === 4) return activity.type === "task";
        if (activeTab === 5) return activity.type === "meeting";
        return true;
    };
    const searchFilter = (a) => {
        const s = activitySearch.toLowerCase();
        return a.title?.toLowerCase().includes(s) ||
            a.description?.toLowerCase().includes(s) ||
            a.createdBy?.toLowerCase().includes(s);
    };
    const upcomingTasks = activities
        .filter(a => a.type === "task" && !a.completed)
        .filter(searchFilter)
        .filter(getTabFilter);
    const historyActivities = activities
        .filter(a => a.type !== "task" || a.completed)
        .filter(searchFilter)
        .filter(getTabFilter);
    const groupActivitiesByMonth = (items) => {
        const groups = {};
        items.forEach(activity => {
            const actDate = new Date(activity.dueDate || activity.date || activity.startDate || activity.createdAt);
            const key = actDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(activity);
        });
        return groups;
    };
    const monthlyGroups = groupActivitiesByMonth(historyActivities);
    const isOverdue = (activity) => {
        if (activity.type !== "task" || activity.completed) return false;
        const dueDate = new Date(activity.dueDate);
        return dueDate < new Date();
    };
    const handleSaveNote = (noteData) => {
        addActivity(noteData);
        toast.success("Note added successfully!");
    };
    const handleSaveEmail = (emailData) => {
        addActivity(emailData);
        toast.success("Email logged successfully!");
    };
    const handleSaveCall = (callData) => {
        addActivity(callData);
        toast.success("Call logged successfully!");
    };
    const handleSaveTask = (taskData) => {
        addActivity(taskData);
        toast.success("Task created successfully!");
    };
    const handleSaveMeeting = (meetingData) => {
        addActivity(meetingData);
        toast.success("Meeting scheduled successfully!");
    };
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        }) + ' at ' + d.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit'
        });
    };
    return (
        <>
            <Box sx={{ minWidth: 0 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search activities"
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    InputProps={{
                        startAdornment: <CustomSearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
                    }}
                    sx={{
                        mb: 3,
                        bgcolor: "#fff",
                        "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc", borderRadius: "8px" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" }
                    }}
                />
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            "& .MuiTab-root": { textTransform: "none", fontSize: "14px", fontWeight: 500, color: "#64748b", minWidth: "auto", mr: 2 },
                            "& .Mui-selected": { color: PRIMARY },
                            "& .MuiTabs-indicator": { backgroundColor: PRIMARY }
                        }}
                    >
                        {TAB_LABELS.map((label, idx) => (
                            <Tab key={idx} label={label} />
                        ))}
                    </Tabs>
                </Box>
                {activeTab > 0 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700} color="#1e293b">
                            {TAB_LABELS[activeTab]}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                const typeMap = { 1: 'note', 2: 'email', 3: 'call', 4: 'task', 5: 'meeting' };
                                const type = typeMap[activeTab];
                                if (type && onDialogOpen) {
                                    onDialogOpen(type);
                                }
                            }}
                            sx={{
                                bgcolor: PRIMARY,
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                px: 2.5,
                                '&:hover': { bgcolor: '#4f46e5' }
                            }}
                        >
                            {activeTab === 1 && 'Create Note'}
                            {activeTab === 2 && 'Create Email'}
                            {activeTab === 3 && 'Make a Call'}
                            {activeTab === 4 && 'Create Task'}
                            {activeTab === 5 && 'Schedule Meeting'}
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
                                        formatDate={formatDate}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                    {Object.entries(monthlyGroups).map(([month, items]) => (
                        <TimeGroup key={month} label={month} items={items} formatDate={formatDate} />
                    ))}
                    {upcomingTasks.length === 0 && historyActivities.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <Typography color="text.secondary">No activities found.</Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
            <CreateNoteDialog
                open={dialogsOpen?.note || false}
                onClose={() => onDialogClose("note")}
                onSave={handleSaveNote}
                leadName={entityName}
            />
            <CreateEmailDialog
                open={dialogsOpen?.email || false}
                onClose={() => onDialogClose("email")}
                onSave={handleSaveEmail}
                leadEmail={entityEmail}
            />
            <LogCallDialog
                open={dialogsOpen?.call || false}
                onClose={() => onDialogClose("call")}
                onSave={handleSaveCall}
                leadName={entityName}
            />
            <CreateTaskDialog
                open={dialogsOpen?.task || false}
                onClose={() => onDialogClose("task")}
                onSave={handleSaveTask}
            />
            <ScheduleMeetingDialog
                open={dialogsOpen?.meeting || false}
                onClose={() => onDialogClose("meeting")}
                onSave={handleSaveMeeting}
                leadName={entityName}
            />
        </>
    );
}
function TimeGroup({ label, items, formatDate }) {
    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b" mb={2}>
                {label}
            </Typography>
            <Stack spacing={2}>
                {items.map(activity => (
                    <ActivityCard key={activity.id} data={activity} formatDate={formatDate} />
                ))}
            </Stack>
        </Box>
    );
}
function ActivityCard({ data, isOverdue, onToggle, formatDate }) {
    const [expanded, setExpanded] = useState(false);
    const isTask = data.type === "task";
    const bodyText = data.description || data.content || "";
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
                            '& .MuiSvgIcon-root': { borderRadius: '50%' },
                            '&.Mui-checked': { color: '#10b981' },
                            '&:not(.Mui-checked)': { color: isOverdue ? '#dc2626' : '#94a3b8' }
                        }}
                        icon={<CircleIcon sx={{ fontSize: 20, opacity: 0.3 }} />}
                        checkedIcon={<CircleIcon sx={{ fontSize: 20 }} />}
                    />
                ) : (
                    <Box
                        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <KeyboardArrowDownIcon
                            fontSize="small"
                            sx={{
                                color: PRIMARY,
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        />
                    </Box>
                )}
                {isTask ? (
                    <Stack direction="row" alignItems="center" spacing={1} flex={1}>
                        <Typography variant="body2" fontWeight={600} color="#1e293b">Task</Typography>
                        {data.createdBy && (
                            <Typography variant="body2" color="#64748b">
                                assigned to {data.createdBy}
                            </Typography>
                        )}
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
    );
}
function CustomSearchIcon(props) {
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
    );
}