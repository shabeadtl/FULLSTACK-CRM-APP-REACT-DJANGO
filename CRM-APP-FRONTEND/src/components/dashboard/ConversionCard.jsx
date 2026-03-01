import { Paper, Typography, Box, LinearProgress } from "@mui/material";

const colors = {
  Contact: "#6C63FF",
  "Qualified Lead": "#2DD4BF",
  "Proposal Sent": "#FACC15",
  Negotiation: "#6366F1",
  "Closed Won": "#22C55E",
  "Closed Lost": "#EF4444",
};

const ConversionCard = ({ data }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography fontWeight={600} mb={2}>
        Contact to Deal Conversion
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.map((item) => (
          <Box key={item.label}>
            <Typography variant="body2" mb={0.5}>
              {item.label}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: 6,
                borderRadius: 5,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: colors[item.label],
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ConversionCard;
