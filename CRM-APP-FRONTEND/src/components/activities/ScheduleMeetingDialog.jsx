import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Stack,
    Box,
    FormControl,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";
import { COLORS } from "../../theme/constants";

const PRIMARY = COLORS.PRIMARY;

const ATTENDEES = ["Maria Johnson", "John Cooper", "Jane Cooper", "You"];
const LOCATIONS = ["Office", "Conference Room A", "Conference Room B", "Virtual (Zoom)", "Virtual (Teams)"];
const REMINDERS = ["15 minutes before", "30 minutes before", "1 hour before", "1 day before"];

export default function ScheduleMeetingDialog({ open, onClose, onSave, leadName }) {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendees, setAttendees] = useState([]);
    const [location, setLocation] = useState("");
    const [reminder, setReminder] = useState("");
    const [note, setNote] = useState("");
    const [formats, setFormats] = useState([]);

    const handleFormatChange = (event, newFormats) => {
        setFormats(newFormats);
    };

    const handleSave = () => {
        if (!title || !startDate || !startTime || !endTime || attendees.length === 0) return;


        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        const duration = diffHrs > 0 ? `${diffHrs} hr${diffMins > 0 ? ` ${diffMins} min` : ""}` : `${diffMins} min`;

        onSave({
            type: "meeting",
            title: `Meeting ${attendees.join(" and ")}`,
            content: note,
            startDate: new Date(`${startDate}T${startTime}`),
            startTime,
            endTime,
            attendees,
            attendeesCount: attendees.length,
            location,
            reminder,
            duration,
            organizer: "You"
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle("");
        setStartDate("");
        setStartTime("");
        setEndTime("");
        setAttendees([]);
        setLocation("");
        setReminder("");
        setNote("");
        setFormats([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "12px" }
            }}
        >
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e2e8f0",
                py: 2
            }}>
                <span style={{ fontWeight: 600, color: "#1e293b" }}>Schedule Meeting</span>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={2.5}>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Title <span style={{ color: "#dc2626" }}>*</span>
                        </span>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                        />
                    </Box>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Start Date <span style={{ color: "#dc2626" }}>*</span>
                        </span>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                        />
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                                Start Time <span style={{ color: "#dc2626" }}>*</span>
                            </span>
                            <TextField
                                fullWidth
                                size="small"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                        </Box>
                        <Box flex={1}>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                                End Time <span style={{ color: "#dc2626" }}>*</span>
                            </span>
                            <TextField
                                fullWidth
                                size="small"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                        </Box>
                    </Stack>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Attendees <span style={{ color: "#dc2626" }}>*</span>
                        </span>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <Select
                                multiple
                                value={attendees}
                                onChange={(e) => setAttendees(e.target.value)}
                                displayEmpty
                                renderValue={(selected) =>
                                    selected.length === 0 ? "Choose" : selected.join(", ")
                                }
                                sx={{ borderRadius: "8px" }}
                            >
                                {ATTENDEES.map(a => (
                                    <MenuItem key={a} value={a}>{a}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Location
                        </span>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <Select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: "8px" }}
                            >
                                <MenuItem value="">Choose</MenuItem>
                                {LOCATIONS.map(l => (
                                    <MenuItem key={l} value={l}>{l}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Reminder
                        </span>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <Select
                                value={reminder}
                                onChange={(e) => setReminder(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: "8px" }}
                            >
                                <MenuItem value="">Choose</MenuItem>
                                {REMINDERS.map(r => (
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Note <span style={{ color: "#dc2626" }}>*</span>
                        </span>

                        <Box sx={{
                            border: "1px solid #e2e8f0",
                            borderBottom: "none",
                            borderRadius: "8px 8px 0 0",
                            p: 1,
                            mt: 1,
                            backgroundColor: "#f8fafc"
                        }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Box sx={{ fontSize: "13px", color: "#64748b", mr: 1 }}>
                                    Normal text <span style={{ fontSize: 10 }}>▼</span>
                                </Box>
                                <ToggleButtonGroup
                                    value={formats}
                                    onChange={handleFormatChange}
                                    size="small"
                                    sx={{ "& .MuiToggleButton-root": { border: "none", p: 0.5 } }}
                                >
                                    <ToggleButton value="bold"><FormatBoldIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                    <ToggleButton value="italic"><FormatItalicIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                    <ToggleButton value="underline"><FormatUnderlinedIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                    <ToggleButton value="bullet"><FormatListBulletedIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                    <ToggleButton value="number"><FormatListNumberedIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                    <ToggleButton value="image"><ImageIcon sx={{ fontSize: 18 }} /></ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Enter"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "0 0 8px 8px",
                                    "& fieldset": { borderColor: "#e2e8f0" }
                                }
                            }}
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        flex: 1,
                        borderColor: "#e2e8f0",
                        color: "#64748b",
                        textTransform: "none",
                        borderRadius: "8px",
                        py: 1.2
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!title || !startDate || !startTime || !endTime || attendees.length === 0}
                    sx={{
                        flex: 1,
                        backgroundColor: PRIMARY,
                        textTransform: "none",
                        borderRadius: "8px",
                        py: 1.2,
                        "&:hover": { backgroundColor: "#4f46e5" }
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
