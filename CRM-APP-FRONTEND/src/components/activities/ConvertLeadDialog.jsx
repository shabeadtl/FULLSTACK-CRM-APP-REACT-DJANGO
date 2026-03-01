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
    InputLabel,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../theme/constants";

const PRIMARY = COLORS.PRIMARY;

const STAGES = [
    "Appointment Scheduled",
    "Qualified to Buy",
    "Presentation Scheduled",
    "Decision Maker Bought In",
    "Contract Sent",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function ConvertLeadDialog({ open, onClose, lead, onConvert }) {
    const [dealName, setDealName] = useState("");
    const [amount, setAmount] = useState("");
    const [stage, setStage] = useState("Appointment Scheduled");
    const [closeDate, setCloseDate] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [city, setCity] = useState("");

    React.useEffect(() => {
        if (open && lead) {
            setDealName(`${lead.name} - Deal`);
            setAmount("");
            setStage("Appointment Scheduled");
            setCloseDate("");
            setPriority("Medium");
            setCity("");
        }
    }, [open, lead]);

    const handleConvert = () => {
        if (!dealName || !amount || !closeDate) return;

        const newDeal = {
            id: Date.now(),
            name: dealName,
            stage,
            closeDate,
            owner: lead?.owner || "Unassigned",
            amount: Number(amount),
            created: new Date().toISOString().slice(0, 10),
            priority,
            city,
            convertedFromLead: lead?.id,
        };

        onConvert(newDeal);
        onClose();
    };

    const handleClose = () => {
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
                <Box>
                    <Typography variant="h6" fontWeight={600} color="#1e293b">
                        Convert Lead to Deal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Converting: {lead?.name}
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={2.5}>
                    <Box>
                        <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                            Deal Name <span style={{ color: "#dc2626" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter deal name"
                            value={dealName}
                            onChange={(e) => setDealName(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                        />
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                                Amount ($) <span style={{ color: "#dc2626" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                                Priority <span style={{ color: "#dc2626" }}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    sx={{ borderRadius: "8px" }}
                                >
                                    {PRIORITIES.map(p => (
                                        <MenuItem key={p} value={p}>{p}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Box>
                        <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                            Deal Stage <span style={{ color: "#dc2626" }}>*</span>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={stage}
                                onChange={(e) => setStage(e.target.value)}
                                sx={{ borderRadius: "8px" }}
                            >
                                {STAGES.map(s => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                                Close Date <span style={{ color: "#dc2626" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                value={closeDate}
                                onChange={(e) => setCloseDate(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={500} color="#1e293b" mb={1}>
                                City
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                        </Box>
                    </Stack>
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
                    onClick={handleConvert}
                    disabled={!dealName || !amount || !closeDate}
                    sx={{
                        flex: 1,
                        backgroundColor: PRIMARY,
                        textTransform: "none",
                        borderRadius: "8px",
                        py: 1.2,
                        "&:hover": { backgroundColor: "#4f46e5" }
                    }}
                >
                    Convert to Deal
                </Button>
            </DialogActions>
        </Dialog>
    );
}
