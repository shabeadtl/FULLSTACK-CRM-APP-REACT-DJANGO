import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Divider,
    Stack,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import { COLORS } from "../../theme/constants";

export default function RichTextEditor({
    label,
    value,
    onChange,
    placeholder = "Start typing...",
    height = 150,
    required = false,
}) {
    const editorRef = useRef(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (editorRef.current && !initialized && value) {
            editorRef.current.innerHTML = value;
            setInitialized(true);
        }
    }, [value, initialized]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateValue();
    };

    const updateValue = () => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            execCommand("createLink", url);
        }
    };

    const ToolbarButton = ({ onClick, children, title }) => (
        <IconButton
            size="small"
            onClick={onClick}
            title={title}
            sx={{
                borderRadius: "6px",
                p: 0.75,
                "&:hover": {
                    backgroundColor: "#e2e8f0",
                    color: COLORS.PRIMARY,
                },
            }}
        >
            {children}
        </IconButton>
    );

    return (
        <Box>
            {label && (
                <Typography
                    variant="body2"
                    fontWeight={500}
                    color="#1e293b"
                    mb={1}
                >
                    {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
                </Typography>
            )}
            <Box
                sx={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    "&:focus-within": {
                        borderColor: COLORS.PRIMARY,
                        boxShadow: `0 0 0 2px ${COLORS.PRIMARY}20`,
                    },
                }}
            >
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                        p: 0.75,
                    }}
                >
                    <ToolbarButton onClick={() => execCommand("bold")} title="Bold">
                        <FormatBoldIcon fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand("italic")} title="Italic">
                        <FormatItalicIcon fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand("underline")} title="Underline">
                        <FormatUnderlinedIcon fontSize="small" />
                    </ToolbarButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    <ToolbarButton onClick={() => execCommand("insertUnorderedList")} title="Bullet List">
                        <FormatListBulletedIcon fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand("insertOrderedList")} title="Numbered List">
                        <FormatListNumberedIcon fontSize="small" />
                    </ToolbarButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    <ToolbarButton onClick={handleLink} title="Insert Link">
                        <LinkIcon fontSize="small" />
                    </ToolbarButton>
                </Stack>

                <Box
                    ref={editorRef}
                    contentEditable="true"
                    onInput={updateValue}
                    onBlur={updateValue}
                    data-placeholder={placeholder}
                    sx={{
                        minHeight: height,
                        p: 2,
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#fff",
                        overflowY: "auto",
                        "&:empty:before": {
                            content: "attr(data-placeholder)",
                            color: "#94a3b8",
                            pointerEvents: "none",
                        },
                        "& ul, & ol": {
                            pl: 3,
                            my: 1,
                        },
                        "& a": {
                            color: COLORS.PRIMARY,
                            textDecoration: "underline",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
