


export const COLORS = {
    PRIMARY: "#5B4DDB",
    PRIMARY_HOVER: "#4f46e5",
    PRIMARY_GRADIENT: "linear-gradient(135deg, #5B4DDB 0%, #7c3aed 100%)",
    PRIMARY_GRADIENT_HOVER: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",


    BG: "#f8f9fc",
    BG_CARD: "#fff",
    BG_INPUT: "#f8fafc",


    BORDER: "#e2e8f0",
    BORDER_HOVER: "#cbd5e1",


    TEXT_PRIMARY: "#1e293b",
    TEXT_SECONDARY: "#64748b",
    TEXT_MUTED: "#94a3b8",


    DELETE: "#dc2626",
    DELETE_BG: "#fee2e2",
    DELETE_HOVER: "#fecaca",
    SUCCESS: "#059669",
    SUCCESS_BG: "#d1fae5",
};


export const LEAD_STATUS_COLORS = {
    "New Lead": { bg: "#dbeafe", color: "#2563eb" },
    "Contacted": { bg: "#fef3c7", color: "#d97706" },
    "Qualified": { bg: "#d1fae5", color: "#059669" },
    "Lost": { bg: "#fee2e2", color: "#dc2626" },
    "Won": { bg: "#d1fae5", color: "#059669" },
};


export const TICKET_STATUS_COLORS = {
    "New": { bg: "#dbeafe", color: "#2563eb" },
    "Waiting on us": { bg: "#fef3c7", color: "#d97706" },
    "Waiting on contact": { bg: "#e0e7ff", color: "#4f46e5" },
    "Closed": { bg: "#d1fae5", color: "#059669" },
};


export const PRIORITY_COLORS = {
    "Critical": { bg: "#fee2e2", color: "#dc2626" },
    "High": { bg: "#ffedd5", color: "#ea580c" },
    "Medium": { bg: "#fef3c7", color: "#d97706" },
    "Low": { bg: "#d1fae5", color: "#059669" },
};


export const getStatusColor = (status, type = "ticket") => {
    const colors = type === "lead" ? LEAD_STATUS_COLORS : TICKET_STATUS_COLORS;
    return colors[status] || { bg: "#f3f4f6", color: "#6b7280" };
};

export const getPriorityColor = (priority) => {
    return PRIORITY_COLORS[priority] || { bg: "#f3f4f6", color: "#6b7280" };
};
