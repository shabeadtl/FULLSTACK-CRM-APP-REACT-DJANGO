import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../theme/constants";
import { apiGet } from "../../services/api";

const PRIMARY = COLORS.PRIMARY;

export default function GlobalSearch() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const performSearch = useCallback(async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        const q = query.toLowerCase();
        const results = [];

        try {
            const [leadsRes, dealsRes, companiesRes, ticketsRes] = await Promise.all([
                apiGet("/leads/").catch(() => null),
                apiGet("/deals/").catch(() => null),
                apiGet("/companies/").catch(() => null),
                apiGet("/tickets/").catch(() => null),
            ]);
            if (leadsRes && leadsRes.ok) {
                const leads = await leadsRes.json();
                leads.forEach((lead) => {
                    if (
                        lead.name?.toLowerCase().includes(q) ||
                        lead.email?.toLowerCase().includes(q) ||
                        lead.company?.toLowerCase().includes(q)
                    ) {
                        results.push({
                            type: "lead", id: lead.id, name: lead.name,
                            subtitle: lead.email || lead.company || "",
                            path: `/leads/${lead.id}`,
                        });
                    }
                });
            }
            if (dealsRes && dealsRes.ok) {
                const deals = await dealsRes.json();
                deals.forEach((deal) => {
                    if (
                        deal.name?.toLowerCase().includes(q) ||
                        (typeof deal.owner === "string" && deal.owner.toLowerCase().includes(q))
                    ) {
                        results.push({
                            type: "deal", id: deal.id, name: deal.name,
                            subtitle: `$${Number(deal.amount || 0).toLocaleString()}`,
                            path: `/deals/${deal.id}`,
                        });
                    }
                });
            }
            if (companiesRes && companiesRes.ok) {
                const companies = await companiesRes.json();
                companies.forEach((company) => {
                    if (
                        company.name?.toLowerCase().includes(q) ||
                        company.industry?.toLowerCase().includes(q) ||
                        company.city?.toLowerCase().includes(q)
                    ) {
                        results.push({
                            type: "company", id: company.id, name: company.name,
                            subtitle: company.industry || "",
                            path: `/companies/${company.id}`,
                        });
                    }
                });
            }
            if (ticketsRes && ticketsRes.ok) {
                const tickets = await ticketsRes.json();
                tickets.forEach((ticket) => {
                    if (
                        ticket.name?.toLowerCase().includes(q) ||
                        ticket.description?.toLowerCase().includes(q)
                    ) {
                        results.push({
                            type: "ticket", id: ticket.id, name: ticket.name,
                            subtitle: ticket.status || "",
                            path: `/tickets/${ticket.id}`,
                        });
                    }
                });
            }
        } catch (e) {
            console.error("Search error:", e);
        }

        setSearchResults(results.slice(0, 10));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleInputFocus = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleResultClick = (path) => {
        navigate(path);
        handleClose();
    };

    const getIcon = (type) => {
        switch (type) {
            case "lead": return <PersonIcon sx={{ color: "#10b981" }} />;
            case "deal": return <HandshakeIcon sx={{ color: "#f59e0b" }} />;
            case "company": return <BusinessIcon sx={{ color: "#3b82f6" }} />;
            case "ticket": return <ConfirmationNumberIcon sx={{ color: "#8b5cf6" }} />;
            default: return <SearchIcon />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "lead": return { label: "Lead", color: "#10b981", bg: "#d1fae5" };
            case "deal": return { label: "Deal", color: "#f59e0b", bg: "#fef3c7" };
            case "company": return { label: "Company", color: "#3b82f6", bg: "#dbeafe" };
            case "ticket": return { label: "Ticket", color: "#8b5cf6", bg: "#ede9fe" };
            default: return { label: type, color: "#64748b", bg: "#f1f5f9" };
        }
    };

    const open = Boolean(anchorEl) && searchQuery.length >= 2;

    return (
        <Box sx={{ position: "relative" }}>
            <TextField
                size="small"
                placeholder="Search leads, deals, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                sx={{
                    width: 280,
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f8fafc",
                        borderRadius: "10px",
                        fontSize: "14px",
                        "&:hover fieldset": { borderColor: PRIMARY },
                        "&.Mui-focused fieldset": { borderColor: PRIMARY },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableAutoFocus
                disableEnforceFocus
                PaperProps={{
                    sx: {
                        width: 400,
                        maxHeight: 400,
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                        mt: 1,
                    },
                }}
            >
                {searchResults.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <SearchIcon sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
                        <Typography color="text.secondary" fontSize={14}>
                            No results found for "{searchQuery}"
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e2e8f0" }}>
                            <Typography fontSize={12} color="text.secondary" fontWeight={500}>
                                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                            </Typography>
                        </Box>
                        <List sx={{ py: 0, maxHeight: 340, overflow: "auto" }}>
                            {searchResults.map((result, index) => {
                                const typeInfo = getTypeLabel(result.type);
                                return (
                                    <React.Fragment key={`${result.type}-${result.id}`}>
                                        <ListItem
                                            onClick={() => handleResultClick(result.path)}
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                cursor: "pointer",
                                                "&:hover": { backgroundColor: "#f8fafc" },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {getIcon(result.type)}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography fontSize={14} fontWeight={500} color="#1e293b">
                                                        {result.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography fontSize={12} color="#64748b" noWrap>
                                                        {result.subtitle}
                                                    </Typography>
                                                }
                                            />
                                            <Chip
                                                label={typeInfo.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: typeInfo.bg,
                                                    color: typeInfo.color,
                                                    fontSize: "11px",
                                                    fontWeight: 500,
                                                    height: 22,
                                                }}
                                            />
                                        </ListItem>
                                        {index < searchResults.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </>
                )}
            </Popover>
        </Box>
    );
}
