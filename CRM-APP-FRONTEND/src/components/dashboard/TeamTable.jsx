import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  Stack,
} from "@mui/material";

const TeamTable = ({ rows }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExportCSV = () => {
    if (!rows || rows.length === 0) return;
    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue", "Trend"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [r.name, r.active, r.closed, `$${r.revenue.toLocaleString()}`, r.trend].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team_performance_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 0 },
          mb: 2,
        }}
      >
        <Typography fontWeight={600} fontSize={{ xs: "14px", md: "16px" }}>
          Team Performance Tracking
        </Typography>
        <Button
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          onClick={handleExportCSV}
          sx={{ textTransform: "none" }}
        >
          Export CSV
        </Button>
      </Box>
      {isMobile ? (
        <Stack spacing={2}>
          {rows.map((row) => (
            <Card key={row.name} variant="outlined" sx={{ p: 2, borderRadius: "12px" }}>
              <Typography fontWeight={600} mb={1}>{row.name}</Typography>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">Active Deals</Typography>
                <Typography variant="body2" fontWeight={500}>{row.active}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">Closed Deals</Typography>
                <Typography variant="body2" fontWeight={500}>{row.closed}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">Revenue</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    ${row.revenue.toLocaleString()}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: 11,
                      backgroundColor: row.trend.startsWith("+") ? "#DCFCE7" : "#FEE2E2",
                      color: row.trend.startsWith("+") ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {row.trend}
                  </Box>
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        /* Desktop: Table Layout */
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell align="center">Active Deals</TableCell>
                <TableCell align="center">Closed Deals</TableCell>
                <TableCell align="right">Revenue</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">{row.active}</TableCell>
                  <TableCell align="center">{row.closed}</TableCell>
                  <TableCell align="right">
                    ${row.revenue.toLocaleString()}{" "}
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: 12,
                        backgroundColor:
                          row.trend.startsWith("+")
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        color:
                          row.trend.startsWith("+")
                            ? "#16A34A"
                            : "#DC2626",
                      }}
                    >
                      {row.trend}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
};

export default TeamTable;
