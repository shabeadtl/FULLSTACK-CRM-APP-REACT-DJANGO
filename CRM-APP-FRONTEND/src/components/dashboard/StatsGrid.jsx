import { Box } from "@mui/material";
import StatsCard from "./StatsCard";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
const StatsGrid = ({ stats }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: { xs: "12px", md: "24px" },
      }}
    >
      <StatsCard
        title="Total Leads"
        value={stats.totalLeads.toLocaleString()}
        icon={<GroupIcon />}
        bg="#edeaff"
        trend="up"
        trendValue="+12.5%"
      />
      <StatsCard
        title="Active Deals"
        value={stats.activeDeals}
        icon={<WorkIcon />}
        bg="#e6f9f2"
        trend="up"
        trendValue="+8.2%"
      />
      <StatsCard
        title="Closed Deals"
        value={stats.closedDeals}
        icon={<CheckCircleIcon />}
        bg="#ffecec"
        trend="down"
        trendValue="-2.1%"
      />
      <StatsCard
        title="Monthly Revenue"
        value={`$${stats.monthlyRevenue.toLocaleString()}`}
        icon={<MonetizationOnIcon />}
        bg="#fff4dd"
        trend="up"
        trendValue="+15.3%"
      />
    </Box>
  );
};
export default StatsGrid;