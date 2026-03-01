import { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardLayout from "../../layout/DashboardLayout";
import { initialDashboardData } from "../../data/dashboardData";
import { apiGet } from "../../services/api";
import StatsGrid from "../../components/dashboard/StatsGrid";
import ConversionCard from "../../components/dashboard/ConversionCard";
import SalesChart from "../../components/dashboard/SalesChart";
import TeamTable from "../../components/dashboard/TeamTable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [period, setPeriod] = useState("monthly");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiGet("/leads/dashboard/");
        if (res && res.ok) {
          const data = await res.json();
          setDashboardData((prev) => ({
            ...prev,
            stats: data.stats,
            conversion: data.conversion && data.conversion.length > 0 ? data.conversion : prev.conversion,
            sales: data.sales ? data.sales : prev.sales,
            team: data.team && data.team.length > 0 ? data.team : prev.team,
          }));
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userName = currentUser.first_name || currentUser.firstName || "User";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: isSmall ? "short" : "long",
    year: "numeric",
    month: isSmall ? "short" : "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: "1277px",
          display: "flex",
          flexDirection: "column",
          gap: { xs: "16px", md: "24px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: "#1e293b",
                mb: 0.5,
                fontSize: { xs: "1.5rem", md: "2.125rem" }
              }}
            >
              Welcome back, {userName}! 👋
            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#fff",
              padding: { xs: "8px 12px", md: "10px 16px" },
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
          >
            <CalendarTodayIcon
              sx={{ fontSize: { xs: 16, md: 18 }, color: "#5b4ddb" }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 500, fontSize: { xs: "12px", md: "14px" } }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        <StatsGrid stats={dashboardData.stats} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
            gap: { xs: 2, md: 3 }
          }}
        >
          <ConversionCard data={dashboardData.conversion} />

          <SalesChart
            data={dashboardData.sales[period]}
            period={period}
            onPeriodChange={setPeriod}
          />
        </Box>

        <TeamTable rows={dashboardData.team} />
      </Box>
    </DashboardLayout>
  );
};

export default DashboardPage;
