import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../theme/constants";
import { RichTextEditor } from "../common";

const PRIMARY = COLORS.PRIMARY;

export default function CreateNoteDialog({ open, onClose, onSave, leadName }) {
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!note.trim()) return;
        onSave({
            type: "note",
            title: `Note by You`,
            content: note,
            date: new Date()
        });
        setNote("");
        onClose();
    };

    const handleClose = () => {
        setNote("");
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
                <span style={{ fontWeight: 600, color: "#1e293b" }}>Create Note</span>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <RichTextEditor
                    label="Note"
                    value={note}
                    onChange={setNote}
                    placeholder="Enter your note..."
                    height={150}
                    required
                />
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
                        py: 1.2,
                        "&:hover": {
                            borderColor: "#cbd5e1",
                            backgroundColor: "#f8fafc"
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!note.trim()}
                    sx={{
                        flex: 1,
                        backgroundColor: PRIMARY,
                        textTransform: "none",
                        borderRadius: "8px",
                        py: 1.2,
                        "&:hover": {
                            backgroundColor: "#4f46e5"
                        }
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
