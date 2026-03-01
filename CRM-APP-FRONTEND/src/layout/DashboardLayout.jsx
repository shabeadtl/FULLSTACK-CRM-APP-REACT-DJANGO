import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      <TopNavbar />

      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            padding: { xs: "16px", sm: "20px", md: "24px" },
            marginTop: { xs: "70px", md: "87px" },
            marginLeft: { xs: 0, md: "90px" },
            minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
