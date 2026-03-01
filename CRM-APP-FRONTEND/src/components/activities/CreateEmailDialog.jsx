import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    IconButton,
    Stack,
    Box,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LinkIcon from "@mui/icons-material/Link";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import { COLORS } from "../../theme/constants";

const PRIMARY = COLORS.PRIMARY;

export default function CreateEmailDialog({ open, onClose, onSave, leadEmail }) {
    const [recipients, setRecipients] = useState(leadEmail || "");
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [cc, setCc] = useState("");
    const [bcc, setBcc] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSave = () => {
        if (!recipients.trim() || !subject.trim()) return;
        onSave({
            type: "email",
            title: `Logged Email - ${subject}`,
            content: body,
            recipients,
            cc,
            bcc,
            subject,
            date: new Date()
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setRecipients(leadEmail || "");
        setShowCcBcc(false);
        setCc("");
        setBcc("");
        setSubject("");
        setBody("");
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
                sx: { borderRadius: "12px", overflow: "hidden" }
            }}
        >
            <Box sx={{
                backgroundColor: PRIMARY,
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                    New Email
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: "#fff" }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 2, py: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Recipients"
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                            sx={{ "& input": { fontSize: "14px" } }}
                        />
                        <Typography
                            sx={{
                                color: "#64748b",
                                fontSize: "13px",
                                cursor: "pointer",
                                "&:hover": { color: PRIMARY }
                            }}
                            onClick={() => setShowCcBcc(!showCcBcc)}
                        >
                            Cc Bcc
                        </Typography>
                    </Stack>
                </Box>
                {showCcBcc && (
                    <>
                        <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 2, py: 1.5 }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Cc"
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                sx={{ "& input": { fontSize: "14px" } }}
                            />
                        </Box>
                        <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 2, py: 1.5 }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Bcc"
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                sx={{ "& input": { fontSize: "14px" } }}
                            />
                        </Box>
                    </>
                )}
                <Box sx={{ borderBottom: "1px solid #e2e8f0", px: 2, py: 1.5 }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        sx={{ "& input": { fontSize: "14px" } }}
                    />
                </Box>
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 1 }}>
                        Body Text
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        variant="standard"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        sx={{ "& textarea": { fontSize: "14px" } }}
                    />
                </Box>
                <Box sx={{
                    borderTop: "1px solid #e2e8f0",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={!recipients.trim() || !subject.trim()}
                            endIcon={<ArrowDropDownIcon />}
                            sx={{
                                backgroundColor: PRIMARY,
                                textTransform: "none",
                                borderRadius: "6px",
                                px: 2,
                                "&:hover": { backgroundColor: "#4f46e5" }
                            }}
                        >
                            Send
                        </Button>
                        <IconButton size="small" sx={{ color: "#64748b" }}>
                            <TextFormatIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#64748b" }}>
                            <AttachFileIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#64748b" }}>
                            <LinkIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#64748b" }}>
                            <EmojiEmotionsOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#64748b" }}>
                            <ImageOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    <IconButton size="small" sx={{ color: "#64748b" }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
