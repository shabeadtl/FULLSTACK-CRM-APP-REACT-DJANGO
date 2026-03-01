import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiPut } from "../../services/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
      setForm(storedUser);
    }
  }, []);

  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await apiPut(`/auth/users/${user.id}/`, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || "",
        company: form.company || "",
        industry: form.industry || "",
        country: form.country || "",
      });
      if (res && res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setForm(updatedUser);
        setEditMode(false);
        setSnackbarOpen(true);
      } else {
        localStorage.setItem("currentUser", JSON.stringify(form));
        setUser(form);
        setEditMode(false);
        setSnackbarOpen(true);
      }
    } catch (err) {
      localStorage.setItem("currentUser", JSON.stringify(form));
      setUser(form);
      setEditMode(false);
      setSnackbarOpen(true);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = () => {
    setPasswordError("");

    if (!passwordForm.oldPassword) {
      setPasswordError("Old password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError("New password cannot be empty");
      return;
    }

    setPasswordForm({ oldPassword: "", newPassword: "" });
    setSnackbarOpen(true);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: "900px" }}>
        <Paper sx={{ p: 4, borderRadius: "12px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Profile
            </Typography>

            {!editMode ? (
              <Button variant="outlined" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setForm(user);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            {[
              { label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Company", name: "company" },
              { label: "Industry", name: "industry" },
              { label: "Country", name: "country" },
            ].map((field) => (
              <Grid item xs={6} key={field.name}>
                <Typography color="text.secondary" mb={0.5}>
                  {field.label}
                </Typography>

                {editMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <Typography>{user[field.name] || "-"}</Typography>
                )}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Reset Password
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  name="oldPassword"
                  label="Old Password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  name="newPassword"
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
            </Grid>

            {passwordError && (
              <Typography color="error" mt={1}>
                {passwordError}
              </Typography>
            )}

            <Button sx={{ mt: 2 }} variant="contained" onClick={handleResetPassword}>
              Update Password
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated successfully"
      />
    </DashboardLayout>
  );
};

export default ProfilePage;
