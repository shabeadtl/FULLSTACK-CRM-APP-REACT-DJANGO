import React, { useState, useEffect } from "react";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import { apiGet, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";
import { useNotifications } from "../../context/NotificationContext";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Avatar,
    Stack,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { addNotification } = useNotifications();

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const fetchUsers = async () => {
        try {
            const res = await apiGet("/auth/users/");
            if (res && res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error("Failed to load users");
            }
        } catch (err) {
            toast.error("Error fetching users");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditUser({ ...user });
        setEditOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const res = await apiPut(`/auth/users/${editUser.id}/`, {
                first_name: editUser.first_name,
                last_name: editUser.last_name,
                email: editUser.email,
                phone: editUser.phone || "",
                company: editUser.company || "",
                is_active: editUser.is_active,
                is_staff: editUser.is_staff,
                is_superuser: editUser.is_superuser,
            });
            if (res && res.ok) {
                toast.success("User updated successfully");
                addNotification({
                    type: "update",
                    title: "User Updated",
                    message: `${editUser.first_name} ${editUser.last_name}`,
                });
                setEditOpen(false);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update user");
            }
        } catch (err) {
            toast.error("Error updating user");
        }
    };

    const handleDelete = async (user) => {
        try {
            const res = await apiDelete(`/auth/users/${user.id}/`);
            if (res && (res.ok || res.status === 204)) {
                toast.success("User deleted");
                addNotification({
                    type: "delete",
                    title: "User Deleted",
                    message: `${user.first_name} ${user.last_name}`,
                });
                setDeleteConfirm(null);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete user");
            }
        } catch (err) {
            toast.error("Error deleting user");
        }
    };

    const getRoleBadge = (user) => {
        if (user.is_superuser) {
            return (
                <Chip
                    icon={<AdminPanelSettingsIcon />}
                    label="Super Admin"
                    size="small"
                    sx={{ backgroundColor: "#ede7f6", color: "#5b4ddb", fontWeight: 600 }}
                />
            );
        }
        if (user.is_staff) {
            return (
                <Chip
                    icon={<AdminPanelSettingsIcon />}
                    label="Staff"
                    size="small"
                    sx={{ backgroundColor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }}
                />
            );
        }
        return (
            <Chip
                icon={<PersonIcon />}
                label="User"
                size="small"
                sx={{ backgroundColor: "#f5f5f5", color: "#757575", fontWeight: 600 }}
            />
        );
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, marginLeft: { xs: 0, md: "90px" } }}>
                <TopNavbar />
                <Box sx={{ padding: { xs: "100px 16px 24px", md: "100px 32px 32px" } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box>
                            <Typography variant="h5" fontWeight={700} color="#1e293b">
                                User Management
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                Manage all registered users — admin only
                            </Typography>
                        </Box>
                        <Chip
                            label={`${users.length} Users`}
                            sx={{ backgroundColor: "#ede7f6", color: "#5b4ddb", fontWeight: 600 }}
                        />
                    </Stack>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress sx={{ color: "#5b4ddb" }} />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Company</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Joined</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569", textAlign: "center" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} hover sx={{ "&:hover": { backgroundColor: "#fafaff" } }}>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <Avatar sx={{ bgcolor: "#5b4ddb", width: 36, height: 36, fontSize: 14 }}>
                                                        {(user.first_name?.[0] || "").toUpperCase()}
                                                        {(user.last_name?.[0] || "").toUpperCase()}
                                                    </Avatar>
                                                    <Typography fontWeight={600} fontSize={14}>
                                                        {user.first_name} {user.last_name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ color: "#475569", fontSize: 14 }}>{user.email}</TableCell>
                                            <TableCell sx={{ color: "#475569", fontSize: 14 }}>{user.company || "—"}</TableCell>
                                            <TableCell>{getRoleBadge(user)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.is_active ? "Active" : "Inactive"}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: user.is_active ? "#e8f5e9" : "#ffebee",
                                                        color: user.is_active ? "#2e7d32" : "#c62828",
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: "#475569", fontSize: 13 }}>
                                                {new Date(user.date_joined).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <Tooltip title="Edit User">
                                                    <IconButton size="small" onClick={() => handleEdit(user)} sx={{ color: "#5b4ddb" }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {user.id !== currentUser.id && (
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setDeleteConfirm(user)}
                                                            sx={{ color: "#ef5350", ml: 0.5 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
                <DialogContent>
                    {editUser && (
                        <Stack spacing={2} mt={1}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    value={editUser.first_name}
                                    onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                                />
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    value={editUser.last_name}
                                    onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                                />
                            </Stack>
                            <TextField
                                label="Email"
                                fullWidth
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                            />
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Phone"
                                    fullWidth
                                    value={editUser.phone || ""}
                                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                />
                                <TextField
                                    label="Company"
                                    fullWidth
                                    value={editUser.company || ""}
                                    onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
                                />
                            </Stack>
                            <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editUser.is_active}
                                            onChange={(e) => setEditUser({ ...editUser, is_active: e.target.checked })}
                                            color="success"
                                        />
                                    }
                                    label="Active"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editUser.is_staff}
                                            onChange={(e) => setEditUser({ ...editUser, is_staff: e.target.checked })}
                                            sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#1976d2" } }}
                                        />
                                    }
                                    label="Staff"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editUser.is_superuser}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, is_superuser: e.target.checked, is_staff: e.target.checked || editUser.is_staff })
                                            }
                                            sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5b4ddb" } }}
                                        />
                                    }
                                    label="Super Admin"
                                />
                            </Stack>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ color: "#64748b" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        sx={{ backgroundColor: "#5b4ddb", "&:hover": { backgroundColor: "#4a3dc7" } }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete User?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>
                            {deleteConfirm?.first_name} {deleteConfirm?.last_name}
                        </strong>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteConfirm(null)} sx={{ color: "#64748b" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDelete(deleteConfirm)}
                        variant="contained"
                        sx={{ backgroundColor: "#ef5350", "&:hover": { backgroundColor: "#d32f2f" } }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUsersPage;
