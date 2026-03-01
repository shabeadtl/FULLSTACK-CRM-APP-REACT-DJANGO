import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNotifications } from "../../context/NotificationContext";
import { COLORS } from "../../theme/constants";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  InputAdornment,
  Checkbox,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;
const BORDER = COLORS.BORDER;
const STATUS = ["New", "Waiting on us", "Waiting on contact", "Closed"];
const PRIORITY = ["Low", "Medium", "High", "Critical"];
const SOURCE = ["Chat", "Email", "Phone"];
const OWNERS = ["Jane Cooper", "Wade Warren", "Brooklyn Simmons", "Leslie Alexander", "Jenny Wilson", "Guy Hawkins", "Robert Fox"];
const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical": return { bg: "#fee2e2", color: "#dc2626" };
    case "High": return { bg: "#ffedd5", color: "#ea580c" };
    case "Medium": return { bg: "#fef3c7", color: "#d97706" };
    case "Low": return { bg: "#d1fae5", color: "#059669" };
    default: return { bg: "#f3f4f6", color: "#6b7280" };
  }
};
const getStatusColor = (status) => {
  switch (status) {
    case "New": return { bg: "#dbeafe", color: "#2563eb" };
    case "Waiting on us": return { bg: "#fef3c7", color: "#d97706" };
    case "Waiting on contact": return { bg: "#e0e7ff", color: "#4f46e5" };
    case "Closed": return { bg: "#d1fae5", color: "#059669" };
    default: return { bg: "#f3f4f6", color: "#6b7280" };
  }
};
export default function TicketsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [rows, setRows] = useState([]);
  const [dealsList, setDealsList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await apiGet("/tickets/");
        if (res && res.ok) {
          const data = await res.json();
          const mapped = data.map((t) => ({
            ...t,
            associatedDeal: t.associated_deal || t.associatedDeal || "",
            associatedCompany: t.associated_company || t.associatedCompany || "",
          }));
          setRows(mapped);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    const fetchDeals = async () => {
      try {
        const res = await apiGet("/deals/");
        if (res && res.ok) setDealsList(await res.json());
      } catch (e) { }
    };
    const fetchCompanies = async () => {
      try {
        const res = await apiGet("/companies/");
        if (res && res.ok) setCompaniesList(await res.json());
      } catch (e) { }
    };
    fetchTickets();
    fetchDeals();
    fetchCompanies();
  }, []);
  const [filters, setFilters] = useState({
    owner: "",
    status: "",
    source: "",
    priority: "",
    created: "",
    city: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "",
    source: "",
    priority: "",
    owner: [],
    city: "",
    associatedDeal: "",
    associatedCompany: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      const ownerStr = Array.isArray(r.owner) ? r.owner.join(", ") : (r.owner || "");
      return (
        (!q ||
          r.name.toLowerCase().includes(q) ||
          ownerStr.toLowerCase().includes(q) ||
          (r.city && r.city.toLowerCase().includes(q))) &&
        (!filters.owner || ownerStr.toLowerCase().includes(filters.owner.toLowerCase())) &&
        (!filters.status || r.status === filters.status) &&
        (!filters.source || r.source === filters.source) &&
        (!filters.priority || r.priority === filters.priority) &&
        (!filters.created || r.created === filters.created) &&
        (!filters.city || (r.city && r.city.toLowerCase().includes(filters.city.toLowerCase())))
      );
    });
  }, [rows, search, filters]);
  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
  const pageRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = pageRows.map((row) => row.id);
      const newSelected = [...new Set([...selected, ...allIds])];
      setSelected(newSelected);
    } else {
      const pageIds = new Set(pageRows.map((row) => row.id));
      const newSelected = selected.filter((id) => !pageIds.has(id));
      setSelected(newSelected);
    }
  };
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }
    setSelected(newSelected);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isAllSelected = pageRows.length > 0 && pageRows.every((row) => selected.includes(row.id));
  const isSomeSelected = pageRows.some((row) => selected.includes(row.id)) && !isAllSelected;
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleDeleteConfirm = async () => {
    const ticketToDelete = rows.find((x) => x.id === deleteId);
    try {
      const res = await apiDelete(`/tickets/${deleteId}/`);
      if (res && (res.ok || res.status === 204)) {
        setRows((prev) => prev.filter((x) => x.id !== deleteId));
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
    setSelected((prev) => prev.filter((id) => id !== deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    toast.success("Ticket deleted successfully!");
    addNotification({
      type: "delete",
      title: "Ticket Deleted",
      message: ticketToDelete?.name || "A ticket was deleted",
    });
  };
  const handleClearSelected = () => {
    if (selected.length === 0) return;
    const count = selected.length;
    setRows((prev) => prev.filter((x) => !selected.includes(x.id)));
    setSelected([]);
    toast.success(`${count} ticket(s) deleted successfully!`);
    addNotification({
      type: "delete",
      title: "Multiple Tickets Deleted",
      message: `${count} ticket(s) were deleted`,
    });
  };
  const clearFilters = () => {
    setFilters({
      owner: "",
      status: "",
      source: "",
      priority: "",
      created: "",
    });
    setSearch("");
  };
  const openCreateDrawer = () => {
    setEditRow(null);
    setForm({
      name: "",
      description: "",
      status: "",
      source: "",
      priority: "",
      owner: [],
      city: "",
      associatedDeal: "",
      associatedCompany: "",
    });
    setDrawerOpen(true);
  };
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter ticket name");
      return;
    }
    const ownerStr = Array.isArray(form.owner) ? form.owner.join(", ") : (form.owner || "");
    const payload = {
      name: form.name,
      description: form.description || "",
      status: form.status || "New",
      source: form.source || "Email",
      priority: form.priority || "Medium",
      owner: ownerStr,
      city: form.city || "",
      associated_deal: form.associatedDeal || "",
      associated_company: form.associatedCompany || "",
    };
    const normalizeTicket = (t) => ({
      ...t,
      associatedDeal: t.associated_deal || t.associatedDeal || "",
      associatedCompany: t.associated_company || t.associatedCompany || "",
    });
    if (editRow) {
      try {
        const res = await apiPut(`/tickets/${editRow.id}/`, payload);
        if (res && res.ok) {
          const updated = await res.json();
          setRows((prev) =>
            prev.map((r) => (r.id === editRow.id ? normalizeTicket(updated) : r))
          );
        }
      } catch (err) {
        console.error("Error updating ticket:", err);
      }
      toast.success("Ticket updated successfully!");
      addNotification({
        type: "update",
        title: "Ticket Updated",
        message: form.name,
      });
    } else {
      try {
        const res = await apiPost("/tickets/", payload);
        if (res && res.ok) {
          const newTicket = await res.json();
          setRows((prev) => [normalizeTicket(newTicket), ...prev]);
        }
      } catch (err) {
        console.error("Error creating ticket:", err);
      }
      toast.success("Ticket created successfully!");
      addNotification({
        type: "create",
        title: "New Ticket Created",
        message: form.name,
      });
    }
    setDrawerOpen(false);
    setEditRow(null);
    setForm({
      name: "",
      description: "",
      status: "",
      source: "",
      priority: "",
      owner: [],
      city: "",
      associatedDeal: "",
      associatedCompany: "",
    });
  };
  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(91, 77, 219);
    doc.text("Tickets Report", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const dataToExport = selected.length > 0
      ? rows.filter(r => selected.includes(r.id))
      : filteredRows;
    const tableData = dataToExport.map(r => [
      r.name,
      r.status,
      r.priority,
      r.source,
      r.owner,
      r.created
    ]);
    autoTable(doc, {
      startY: 38,
      head: [["Ticket Name", "Status", "Priority", "Source", "Owner", "Created"]],
      body: tableData,
      headStyles: {
        fillColor: [91, 77, 219],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [248, 249, 252]
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    });
    const filename = selected.length > 0
      ? `tickets_selected_${new Date().toISOString().slice(0, 10)}.pdf`
      : `tickets_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    toast.success(`Exported ${dataToExport.length} ticket(s) to PDF`);
  };
  return (
    <Box
      sx={{
        padding: { xs: "16px", md: "24px" },
        marginTop: { xs: "70px", md: "87px" },
        marginLeft: { xs: 0, md: "90px" },
        backgroundColor: BG,
        minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" },
        overflow: "auto",
      }}
    >
      <Sidebar />
      <TopNavbar />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track customer support tickets
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {selected.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearSelected}
              sx={{
                borderRadius: "10px",
                borderColor: "#fee2e2",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fecaca"
                },
              }}
            >
              Clear Selected ({selected.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            sx={{
              borderRadius: "10px",
              borderColor: BORDER,
              color: "#64748b",
              "&:hover": { borderColor: PRIMARY, color: PRIMARY },
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDrawer}
            sx={{
              background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)`,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(91, 77, 219, 0.4)",
              "&:hover": {
                background: `linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)`,
              },
            }}
          >
            Create Ticket
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Search tickets by name or owner..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{
            width: 350,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              borderRadius: "10px",
              "&:hover fieldset": { borderColor: PRIMARY },
              "&.Mui-focused fieldset": { borderColor: PRIMARY },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            label={`${filteredRows.length} tickets`}
            size="small"
            sx={{ backgroundColor: "#e0e7ff", color: PRIMARY, fontWeight: 500 }}
          />
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": { borderRadius: "8px" },
              "& .Mui-selected": { backgroundColor: `${PRIMARY} !important`, color: "#fff" },
            }}
          />
        </Stack>
      </Stack>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          mb: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterListIcon sx={{ color: "#94a3b8" }} />
          <TextField
            size="small"
            label="Owner"
            placeholder="Search..."
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          >
            <MenuItem value="">All Status</MenuItem>
            {STATUS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Priority"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            sx={{ minWidth: 130, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          >
            <MenuItem value="">All</MenuItem>
            {PRIORITY.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Source"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            sx={{ minWidth: 120, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          >
            <MenuItem value="">All</MenuItem>
            {SOURCE.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            size="small"
            label="Created Date"
            InputLabelProps={{ shrink: true }}
            value={filters.created}
            onChange={(e) => setFilters({ ...filters, created: e.target.value })}
            sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
          <TextField
            size="small"
            label="City"
            placeholder="Search city..."
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: PRIMARY }}>
              <TableCell padding="checkbox">
                <Checkbox
                  sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                  indeterminate={isSomeSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {["TICKET NAME", "STATUS", "PRIORITY", "SOURCE", "OWNER", "CREATED", "ACTIONS"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    borderBottom: "none",
                    py: 2,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No tickets found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((r) => {
                const isItemSelected = isSelected(r.id);
                const priorityStyle = getPriorityColor(r.priority);
                const statusStyle = getStatusColor(r.status);
                return (
                  <TableRow
                    key={r.id}
                    hover
                    selected={isItemSelected}
                    onClick={() => navigate(`/Tickets/${r.id}`)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f8fafc" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelect(r.id)}
                        sx={{ "&.Mui-checked": { color: PRIMARY } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500} fontSize="14px" color="#1e293b">
                        {r.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 500,
                          fontSize: "12px",
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color,
                          fontWeight: 500,
                          fontSize: "12px",
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px" color="#64748b">
                        {r.source}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {Array.isArray(r.owner) ? r.owner.map((o, i) => (
                          <Chip key={i} label={o} size="small" sx={{ fontSize: "12px" }} />
                        )) : (
                          <Typography fontSize="14px" color="#1e293b">
                            {r.owner}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px" color="#64748b">
                        {r.created}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditRow(r);
                              const ownerArr = r.owner ? (Array.isArray(r.owner) ? r.owner : r.owner.split(", ").filter(Boolean)) : [];
                              setForm({ ...r, owner: ownerArr });
                              setDrawerOpen(true);
                            }}
                            sx={{
                              color: "#64748b",
                              "&:hover": { color: PRIMARY, backgroundColor: "#e0e7ff" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(r.id);
                            }}
                            sx={{
                              color: "#64748b",
                              "&:hover": { color: "#dc2626", backgroundColor: "#fee2e2" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 450, height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2.5}
            sx={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <Typography variant="h6" fontWeight={600} color="#1e293b">
              {editRow ? "Edit Ticket" : "Create Ticket"}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box px={3} py={3} sx={{ flex: 1, overflowY: "auto" }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Ticket Name"
                placeholder="Enter ticket name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                fullWidth
                label="Description"
                placeholder="Enter description"
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Status *</InputLabel>
                  <Select
                    value={form.status}
                    label="Status *"
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {STATUS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Source *</InputLabel>
                  <Select
                    value={form.source}
                    label="Source *"
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {SOURCE.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <FormControl fullWidth>
                <InputLabel>Priority *</InputLabel>
                <Select
                  value={form.priority}
                  label="Priority *"
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">Select</MenuItem>
                  {PRIORITY.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                options={OWNERS}
                value={form.owner || []}
                onChange={(e, newValue) => setForm({ ...form, owner: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ticket Owner(s) *"
                    placeholder="Select owners"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
              <TextField
                fullWidth
                label="City"
                placeholder="Enter city"
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <FormControl fullWidth disabled={!!form.associatedCompany}>
                <InputLabel>Associated Deal</InputLabel>
                <Select
                  value={form.associatedDeal || ""}
                  label="Associated Deal"
                  onChange={(e) => setForm({ ...form, associatedDeal: e.target.value, associatedCompany: "" })}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">None</MenuItem>
                  {dealsList.map((d) => (
                    <MenuItem key={d.id} value={d.name || d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
                {form.associatedCompany && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Clear Associated Company to select a Deal
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth disabled={!!form.associatedDeal}>
                <InputLabel>Associated Company</InputLabel>
                <Select
                  value={form.associatedCompany || ""}
                  label="Associated Company"
                  onChange={(e) => setForm({ ...form, associatedCompany: e.target.value, associatedDeal: "" })}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">None</MenuItem>
                  {companiesList.map((c) => (
                    <MenuItem key={c.id} value={c.name || c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
                {form.associatedDeal && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Clear Associated Deal to select a Company
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Box>
          <Box
            sx={{
              borderTop: `1px solid ${BORDER}`,
              px: 3,
              py: 2,
            }}
          >
            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: "10px", borderColor: BORDER, color: "#64748b" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)`,
                  borderRadius: "10px",
                  px: 3,
                }}
              >
                {editRow ? "Update" : "Create"} Ticket
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle fontWeight={600} color="#1e293b">
          Delete Ticket
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete this ticket?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            sx={{ borderRadius: "10px", borderColor: BORDER }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{ borderRadius: "10px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(viewTicket)}
        onClose={() => setViewTicket(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        {viewTicket && (() => {
          const priorityStyle = getPriorityColor(viewTicket.priority);
          const statusStyle = getStatusColor(viewTicket.status);
          return (
            <>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)`,
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#fff">
                    {viewTicket.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)" mt={0.5}>
                    Ticket #{viewTicket.id}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setViewTicket(null)}
                  sx={{ color: "#fff", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} mb={3}>
                  <Chip
                    label={viewTicket.status}
                    sx={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                  <Chip
                    label={viewTicket.priority + " Priority"}
                    sx={{
                      backgroundColor: priorityStyle.bg,
                      color: priorityStyle.color,
                      fontWeight: 600,
                      fontSize: "13px",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </Stack>
                <Box mb={3}>
                  <Typography variant="subtitle2" color="#94a3b8" mb={0.5}>
                    Description
                  </Typography>
                  <Typography color="#1e293b" fontSize="14px">
                    {viewTicket.description || "No description provided"}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Stack direction="row" spacing={4}>
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="#94a3b8" mb={0.5}>
                        Source
                      </Typography>
                      <Typography color="#1e293b" fontWeight={500}>
                        {viewTicket.source}
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="#94a3b8" mb={0.5}>
                        Owner
                      </Typography>
                      <Typography color="#1e293b" fontWeight={500}>
                        {viewTicket.owner}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box>
                    <Typography variant="subtitle2" color="#94a3b8" mb={0.5}>
                      Created Date
                    </Typography>
                    <Typography color="#1e293b" fontWeight={500}>
                      {new Date(viewTicket.created).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                <Button
                  variant="outlined"
                  onClick={() => setViewTicket(null)}
                  sx={{ borderRadius: "10px", borderColor: BORDER, color: "#64748b" }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditRow(viewTicket);
                    setForm(viewTicket);
                    setViewTicket(null);
                    setDrawerOpen(true);
                  }}
                  sx={{
                    background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)`,
                    borderRadius: "10px",
                  }}
                >
                  Edit Ticket
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </Box>
  );
}