import React from "react";
import { Chip } from "@mui/material";
import { getStatusColor, getPriorityColor } from "../../theme/constants";


export default function StatusBadge({ label, type = "status", size = "small", customColors }) {
    let colors;

    if (customColors) {
        colors = customColors;
    } else {
        switch (type) {
            case "priority":
                colors = getPriorityColor(label);
                break;
            case "lead-status":
                colors = getStatusColor(label, "lead");
                break;
            case "status":
            default:
                colors = getStatusColor(label, "ticket");
                break;
        }
    }

    return (
        <Chip
            label={label}
            size={size}
            sx={{
                backgroundColor: colors.bg,
                color: colors.color,
                fontWeight: 500,
                fontSize: "12px",
                borderRadius: "6px",
            }}
        />
    );
}
