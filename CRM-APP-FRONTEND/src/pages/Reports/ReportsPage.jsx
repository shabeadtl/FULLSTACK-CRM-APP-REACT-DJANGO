import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import React, { useMemo, useState, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { COLORS } from "../../theme/constants";
import { apiGet } from "../../services/api";

const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;


const getMonthName = (monthIndex) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
};

export default function ReportsPage() {
    const [viewType, setViewType] = useState("monthly");
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await apiGet("/deals/");
                if (res && res.ok) {
                    const data = await res.json();
                    setDeals(data);
                }
            } catch (err) {
                console.error("Error fetching deals:", err);
            }
        };
        fetchDeals();
    }, []);


    const chartData = useMemo(() => {
        if (viewType === "monthly") {

            const monthlyData = {};
            const now = new Date();


            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                monthlyData[key] = {
                    label: getMonthName(date.getMonth()),
                    count: 0,
                    amount: 0,
                };
            }


            deals.forEach((deal) => {
                if (deal.created) {
                    const date = new Date(deal.created);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    if (monthlyData[key]) {
                        monthlyData[key].count += 1;
                        monthlyData[key].amount += Number(deal.amount) || 0;
                    }
                }
            });

            return Object.values(monthlyData);
        } else {

            const yearlyData = {};
            const currentYear = new Date().getFullYear();

            for (let i = 4; i >= 0; i--) {
                const year = currentYear - i;
                yearlyData[year] = {
                    label: String(year),
                    count: 0,
                    amount: 0,
                };
            }

            deals.forEach((deal) => {
                if (deal.created) {
                    const year = new Date(deal.created).getFullYear();
                    if (yearlyData[year]) {
                        yearlyData[year].count += 1;
                        yearlyData[year].amount += Number(deal.amount) || 0;
                    }
                }
            });

            return Object.values(yearlyData);
        }
    }, [deals, viewType]);


    const stats = useMemo(() => {
        const totalDeals = deals.length;
        const totalAmount = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const closedWon = deals.filter(d => d.stage === "Closed Won").length;
        const avgDealSize = totalDeals > 0 ? totalAmount / totalDeals : 0;
        const conversionRate = totalDeals > 0 ? ((closedWon / totalDeals) * 100).toFixed(1) : 0;

        return { totalDeals, totalAmount, closedWon, avgDealSize, conversionRate };
    }, [deals]);


    const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

    return (
        <Box
            sx={{
                padding: "24px",
                marginTop: "87px",
                marginLeft: "90px",
                backgroundColor: BG,
                minHeight: "calc(100vh - 87px)",
            }}
        >
            <Sidebar />
            <TopNavbar />


            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="#1e293b">
                        Sales Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Analyze your sales performance over time
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={viewType}
                    exclusive
                    onChange={(e, val) => val && setViewType(val)}
                    size="small"
                    sx={{
                        "& .MuiToggleButton-root": {
                            px: 3,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                        },
                        "& .Mui-selected": {
                            backgroundColor: `${PRIMARY} !important`,
                            color: "#fff !important",
                        },
                    }}
                >
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>
            </Stack>


            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "#dbeafe" }}>
                                <HandshakeIcon sx={{ color: "#3b82f6" }} />
                            </Box>
                            <Box>
                                <Typography color="text.secondary" fontSize={13}>Total Deals</Typography>
                                <Typography fontWeight={700} fontSize={24} color="#1e293b">{stats.totalDeals}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "#d1fae5" }}>
                                <AttachMoneyIcon sx={{ color: "#10b981" }} />
                            </Box>
                            <Box>
                                <Typography color="text.secondary" fontSize={13}>Total Revenue</Typography>
                                <Typography fontWeight={700} fontSize={24} color="#1e293b">
                                    ${stats.totalAmount.toLocaleString()}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "#fef3c7" }}>
                                <EqualizerIcon sx={{ color: "#f59e0b" }} />
                            </Box>
                            <Box>
                                <Typography color="text.secondary" fontSize={13}>Avg Deal Size</Typography>
                                <Typography fontWeight={700} fontSize={24} color="#1e293b">
                                    ${Math.round(stats.avgDealSize).toLocaleString()}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "#ede9fe" }}>
                                <TrendingUpIcon sx={{ color: "#8b5cf6" }} />
                            </Box>
                            <Box>
                                <Typography color="text.secondary" fontSize={13}>Win Rate</Typography>
                                <Typography fontWeight={700} fontSize={24} color="#1e293b">{stats.conversionRate}%</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>


            <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <Typography fontWeight={600} fontSize={16} color="#1e293b" mb={3}>
                    {viewType === "monthly" ? "Monthly Revenue" : "Yearly Revenue"}
                </Typography>

                {chartData.length === 0 || maxAmount === 0 ? (
                    <Box sx={{ py: 8, textAlign: "center" }}>
                        <Typography color="text.secondary">No data available</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", alignItems: "flex-end", height: 250, gap: 1, px: 2 }}>
                        {chartData.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography fontSize={11} color="#64748b" mb={0.5}>
                                    ${(item.amount / 1000).toFixed(0)}k
                                </Typography>
                                <Box
                                    sx={{
                                        width: "100%",
                                        maxWidth: 50,
                                        height: Math.max((item.amount / maxAmount) * 200, 4),
                                        background: `linear-gradient(180deg, ${PRIMARY} 0%, #7c3aed 100%)`,
                                        borderRadius: "6px 6px 0 0",
                                        transition: "height 0.3s ease",
                                        "&:hover": {
                                            opacity: 0.85,
                                        },
                                    }}
                                />
                                <Typography fontSize={12} color="#64748b" mt={1} fontWeight={500}>
                                    {item.label}
                                </Typography>
                                <Typography fontSize={10} color="#94a3b8">
                                    {item.count} deal{item.count !== 1 ? "s" : ""}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
