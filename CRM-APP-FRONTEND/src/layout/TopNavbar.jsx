import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { COLORS } from "../theme/constants";
import { GlobalSearch } from "../components/common";

const PRIMARY = COLORS.PRIMARY;


const getNotificationIcon = (type) => {
  switch (type) {
    case "create":
      return <AddCircleOutlineIcon sx={{ color: "#10b981" }} />;
    case "delete":
      return <DeleteOutlineIcon sx={{ color: "#ef4444" }} />;
    case "update":
      return <EditOutlinedIcon sx={{ color: "#f59e0b" }} />;
    default:
      return <CheckCircleOutlineIcon sx={{ color: PRIMARY }} />;
  }
};


const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const TopNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const open = Boolean(anchorEl);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationItemClick = (notification) => {
    markAsRead(notification.id);
  };

  if (!user) {
    handleLogout();
    return null;
  }

  return (
    <Box
      sx={{
        height: { xs: "70px", md: "87px" },
        px: { xs: 2, md: 3 },
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 3 }}>
        <Typography fontWeight={700} fontSize={{ xs: 18, md: 20 }}>
          CRM
        </Typography>
        {!isMobile && <GlobalSearch />}
        {isMobile && (
          <IconButton onClick={() => setSearchOpen(!searchOpen)}>
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        )}
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
        <IconButton onClick={handleNotificationClick} size={isSmall ? "small" : "medium"}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "11px",
                height: "18px",
                minWidth: "18px",
                fontWeight: 600,
              },
            }}
          >
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: { xs: "90vw", sm: 360 },
              maxWidth: 360,
              maxHeight: 450,
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              mt: 1,
            },
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={600} fontSize={16} color="#1e293b">
              Notifications
              {unreadCount > 0 && (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {unreadCount} new
                </Typography>
              )}
            </Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{ color: PRIMARY, fontSize: "12px", textTransform: "none" }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
              <Typography color="text.secondary" fontSize={14}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0, maxHeight: 320, overflow: "auto" }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    onClick={() => handleNotificationItemClick(notification)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      cursor: "pointer",
                      backgroundColor: notification.read ? "transparent" : "#f8fafc",
                      "&:hover": { backgroundColor: "#f1f5f9" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontSize={14} fontWeight={notification.read ? 400 : 500} color="#1e293b">
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                          <Typography fontSize={12} color="#64748b" noWrap sx={{ maxWidth: 180 }}>
                            {notification.message}
                          </Typography>
                          <Typography fontSize={11} color="#94a3b8">
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                        </Stack>
                      }
                    />
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: PRIMARY,
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          {notifications.length > 0 && (
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                borderTop: "1px solid #e2e8f0",
                textAlign: "center",
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  clearAll();
                  handleClose();
                }}
                sx={{ color: "#64748b", fontSize: "12px", textTransform: "none" }}
              >
                Clear all notifications
              </Button>
            </Box>
          )}
        </Popover>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/profile")}
        >
          <Avatar sx={{ bgcolor: "#5b4ddb", width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }}>
            {(user.first_name || user.firstName)?.[0]?.toUpperCase()}
          </Avatar>
          {!isSmall && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontSize={14} fontWeight={500}>
                {user.first_name || user.firstName}
              </Typography>
              {(user.is_superuser || user.is_staff) && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#5b4ddb",
                    backgroundColor: "#ede7f6",
                    px: 0.8,
                    py: 0.2,
                    borderRadius: "4px",
                    letterSpacing: "0.5px",
                  }}
                >
                  ADMIN
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        <IconButton onClick={handleLogout} size={isSmall ? "small" : "medium"}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
      {isMobile && (
        <Collapse
          in={searchOpen}
          sx={{
            position: "absolute",
            top: "70px",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderBottom: "1px solid #eee",
            px: 2,
            py: 1.5,
            zIndex: 999,
          }}
        >
          <GlobalSearch />
        </Collapse>
      )}
    </Box>
  );
};

export default TopNavbar;
