import React from "react";
import { Drawer, Box, Stack, Typography, IconButton, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../theme/constants";


export default function FormDrawer({
    open,
    onClose,
    title,
    onSave,
    saveLabel = "Save",
    children,
    width = 450,
}) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width, height: "100%", display: "flex", flexDirection: "column" }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={2.5}
                    sx={{ borderBottom: `1px solid ${COLORS.BORDER}` }}
                >
                    <Typography variant="h6" fontWeight={600} color={COLORS.TEXT_PRIMARY}>
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Box px={3} py={3} sx={{ flex: 1, overflowY: "auto" }}>
                    {children}
                </Box>
                <Box
                    px={3}
                    py={2}
                    sx={{
                        borderTop: `1px solid ${COLORS.BORDER}`,
                        backgroundColor: COLORS.BG_INPUT,
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                borderColor: COLORS.BORDER,
                                color: COLORS.TEXT_SECONDARY,
                                "&:hover": { borderColor: COLORS.BORDER_HOVER },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onSave}
                            sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                backgroundColor: COLORS.PRIMARY,
                                boxShadow: `0 4px 14px rgba(91, 77, 219, 0.4)`,
                                "&:hover": { backgroundColor: COLORS.PRIMARY_HOVER },
                            }}
                        >
                            {saveLabel}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
}
