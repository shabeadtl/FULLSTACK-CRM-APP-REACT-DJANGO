import { Box, IconButton, Tooltip, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { useState } from "react";

const navButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: "12px",
  color: "#9e9e9e",
  transition: "all 0.2s ease",

  "&.active": {
    backgroundColor: "rgba(91, 77, 219, 0.12)",
    color: "#5b4ddb",
  },

  "&:hover": {
    backgroundColor: "rgba(91, 77, 219, 0.08)",
  },
};

const navItems = [
  { to: "/dashboard", icon: <DashboardOutlinedIcon />, label: "Dashboard" },
  { to: "/leads", icon: <GroupOutlinedIcon />, label: "Leads" },
  { to: "/companies", icon: <BusinessOutlinedIcon />, label: "Companies" },
  { to: "/deals", icon: <AssignmentOutlinedIcon />, label: "Deals" },
  { to: "/tickets", icon: <ConfirmationNumberOutlinedIcon />, label: "Tickets" },
  { to: "/reports", icon: <BarChartOutlinedIcon />, label: "Reports" },
];

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isAdmin = currentUser.is_superuser || currentUser.is_staff;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: isMobile ? "16px" : "24px",
        gap: "16px",
      }}
    >
      {navItems.map((item) => (
        <Tooltip key={item.to} title={item.label} placement={isMobile ? "right" : "right"}>
          <IconButton
            component={NavLink}
            to={item.to}
            sx={navButtonStyle}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
      {isAdmin && (
        <Tooltip title="Manage Users" placement={isMobile ? "right" : "right"}>
          <IconButton
            component={NavLink}
            to="/admin/users"
            sx={navButtonStyle}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <AdminPanelSettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: "95px",
            left: "8px",
            zIndex: 1200,
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: "#f8fafc" },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: "80px",
              boxSizing: "border-box",
              top: "87px",
              height: "calc(100vh - 87px)",
              borderRight: "1px solid #eee",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>
      </>
    );
  }
  return (
    <Box
      sx={{
        width: "90px",
        height: "100vh",
        backgroundColor: "#ffffff",
        position: "fixed",
        top: "87px",
        left: 0,
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "24px",
        gap: "20px",
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
