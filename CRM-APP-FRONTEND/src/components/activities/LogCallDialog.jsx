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

const CALL_OUTCOMES = [
    "Connected",
    "Left Voicemail",
    "No Answer",
    "Busy",
    "Wrong Number"
];

export default function LogCallDialog({ open, onClose, onSave, leadName }) {
    const [connected, setConnected] = useState(leadName || "");
    const [outcome, setOutcome] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [formats, setFormats] = useState([]);

    const handleFormatChange = (event, newFormats) => {
        setFormats(newFormats);
    };

    const handleSave = () => {
        if (!outcome || !date || !time) return;
        onSave({
            type: "call",
            title: `Call from You`,
            content: note,
            connected,
            outcome,
            date: new Date(`${date}T${time}`),
            time
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setConnected(leadName || "");
        setOutcome("");
        setDate("");
        setTime("");
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
                <span style={{ fontWeight: 600, color: "#1e293b" }}>Make a Call</span>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={2.5}>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Connected <span style={{ color: "#dc2626" }}>*</span>
                        </span>
                        <TextField
                            fullWidth
                            size="small"
                            value={connected}
                            onChange={(e) => setConnected(e.target.value)}
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    backgroundColor: "#f1f5f9"
                                }
                            }}
                        />
                    </Box>
                    <Box>
                        <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                            Call Outcome <span style={{ color: "#dc2626" }}>*</span>
                        </span>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <Select
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: "8px" }}
                            >
                                <MenuItem value="" disabled>Choose</MenuItem>
                                {CALL_OUTCOMES.map(o => (
                                    <MenuItem key={o} value={o}>{o}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                                Date <span style={{ color: "#dc2626" }}>*</span>
                            </span>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                sx={{
                                    mt: 1,
                                    "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                                }}
                            />
                        </Box>
                        <Box flex={1}>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>
                                Time <span style={{ color: "#dc2626" }}>*</span>
                            </span>
                            <TextField
                                fullWidth
                                size="small"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                sx={{
                                    mt: 1,
                                    "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                                }}
                            />
                        </Box>
                    </Stack>
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
                            rows={4}
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
                    disabled={!outcome || !date || !time}
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
