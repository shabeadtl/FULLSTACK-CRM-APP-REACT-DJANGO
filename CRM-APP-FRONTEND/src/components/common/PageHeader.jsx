import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { COLORS } from "../../theme/constants";


export default function PageHeader({ title, subtitle, actions }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
        >
            <Box>
                <Typography variant="h5" fontWeight={700} color={COLORS.TEXT_PRIMARY}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actions && (
                <Stack direction="row" spacing={1.5}>
                    {actions}
                </Stack>
            )}
        </Stack>
    );
}
