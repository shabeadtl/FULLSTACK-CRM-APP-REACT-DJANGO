import { Paper, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
const StatsCard = ({ title, value, icon, bg, trend, trendValue }) => {
  const isPositive = trend === "up";
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        },
        minWidth: 0,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "12px", md: "13px" }, mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            mb: 1,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem" },
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
        {trendValue && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {isPositive ? (
              <TrendingUpIcon
                sx={{ fontSize: 16, color: "#22c55e" }}
              />
            ) : (
              <TrendingDownIcon
                sx={{ fontSize: 16, color: "#ef4444" }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositive ? "#22c55e" : "#ef4444",
                fontWeight: 500,
              }}
            >
              {trendValue}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              vs last month
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": {
            color: "#5b4ddb",
            fontSize: 24,
          },
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};
export default StatsCard;