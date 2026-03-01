import {
  Box,
  Paper,
  Typography,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MAX_VALUE = 10000;

const SalesChart = ({ data, period, onPeriodChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px" }}>
        <Typography>No sales data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 0 },
          mb: 3,
        }}
      >
        <Typography fontWeight={600} fontSize={{ xs: "14px", md: "16px" }}>
          Sales Reports
        </Typography>

        <Select
          size="small"
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          sx={{ minWidth: { xs: 100, md: 120 } }}
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </Box>
      <Box sx={{ overflowX: "auto", pb: 1 }}>
        <Box sx={{ display: "flex", gap: { xs: 1.5, md: 3 }, minWidth: isMobile ? "600px" : "auto" }}>
          <Box
            sx={{
              height: { xs: 180, md: 240 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            {["$10000", "$5000", "$1000", "$500", "$0"].map((label) => (
              <Typography key={label} variant="caption" color="text.secondary" fontSize={{ xs: 10, md: 12 }}>
                {label}
              </Typography>
            ))}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: { xs: "8px", sm: "12px", md: "20px" },
              height: { xs: 180, md: 240 },
            }}
          >
            {data.map((value, index) => {
              const heightPercent = Math.min(
                (value / MAX_VALUE) * 100,
                100
              );

              return (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: { xs: "20px", md: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: "140px", md: "200px" },
                      width: { xs: "10px", sm: "12px", md: "14px" },
                      backgroundColor: "#ede9fe",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: `${heightPercent}%`,
                        background:
                          "linear-gradient(180deg, #7c6cff 0%, #5b4ddb 100%)",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mt={1}
                    fontSize={{ xs: 9, md: 12 }}
                  >
                    {period === "monthly"
                      ? months[index]
                      : `202${index + 1}`}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SalesChart;
