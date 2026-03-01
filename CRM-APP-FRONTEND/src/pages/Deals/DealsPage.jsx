import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNotifications } from "../../context/NotificationContext";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Pagination,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";


import { COLORS, getPriorityColor, getStatusColor } from "../../theme/constants";
import { PageHeader, SearchBar, DataTable, StatusBadge, FormDrawer, FormField } from "../../components/common";


const STAGES = [
  "Appointment Scheduled",
  "Qualified to Buy",
  "Presentation Scheduled",
  "Decision Maker Bought In",
  "Contract Sent",
  "Closed Won",
  "Closed Lost",
];

const PRIORITY = ["Low", "Medium", "High", "Critical"];
const OWNERS = ["Jane Cooper", "Wade Warren", "Brooklyn Simmons", "Leslie Alexander", "Jenny Wilson", "Guy Hawkins", "Robert Fox"];


const STAGE_COLORS = {
  "Appointment Scheduled": { bg: "#dbeafe", color: "#2563eb" },
  "Qualified to Buy": { bg: "#fef3c7", color: "#d97706" },
  "Presentation Scheduled": { bg: "#e0e7ff", color: "#4f46e5" },
  "Decision Maker Bought In": { bg: "#d1fae5", color: "#059669" },
  "Contract Sent": { bg: "#fce7f3", color: "#db2777" },
  "Closed Won": { bg: "#d1fae5", color: "#059669" },
  "Closed Lost": { bg: "#fee2e2", color: "#dc2626" },
};

export default function DealsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();


  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await apiGet("/deals/");
        if (res && res.ok) {
          const data = await res.json();
          const mapped = data.map((d) => ({
            ...d,
            closeDate: d.close_date || d.closeDate || "",
          }));
          setRows(mapped);
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
      }
    };
    fetchDeals();
  }, []);

  const [filters, setFilters] = useState({
    owner: "",
    stage: "",
    closeDate: "",
    created: "",
    city: "",
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({
    name: "",
    stage: "",
    amount: "",
    owner: [],
    closeDate: "",
    priority: "Medium",
    city: "",
  });


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      return (
        (!q || r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q) || (r.city && r.city.toLowerCase().includes(q))) &&
        (!filters.owner || r.owner.toLowerCase().includes(filters.owner.toLowerCase())) &&
        (!filters.stage || r.stage === filters.stage) &&
        (!filters.closeDate || r.closeDate === filters.closeDate) &&
        (!filters.created || r.created === filters.created) &&
        (!filters.city || (r.city && r.city.toLowerCase().includes(filters.city.toLowerCase())))
      );
    });
  }, [rows, search, filters]);

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
  const pageRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);


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


  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const dealToDelete = rows.find((x) => x.id === deleteId);
    try {
      const res = await apiDelete(`/deals/${deleteId}/`);
      if (res && (res.ok || res.status === 204)) {
        setRows((prev) => prev.filter((x) => x.id !== deleteId));
      }
    } catch (err) {
      console.error("Error deleting deal:", err);
    }
    setSelected((prev) => prev.filter((selectedId) => selectedId !== deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    toast.success("Deal deleted successfully!");
    addNotification({
      type: "delete",
      title: "Deal Deleted",
      message: dealToDelete?.name || "A deal was deleted",
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter deal name");
      return;
    }

    const ownerStr = Array.isArray(form.owner) ? form.owner.join(", ") : (form.owner || "");
    const payload = {
      name: form.name,
      stage: form.stage,
      amount: Number(form.amount),
      close_date: form.closeDate,
      owner: ownerStr,
      priority: form.priority || "Medium",
    };

    if (editRow) {
      try {
        const res = await apiPut(`/deals/${editRow.id}/`, payload);
        if (res && res.ok) {
          const updated = await res.json();
          setRows((prev) =>
            prev.map((r) => (r.id === editRow.id ? { ...updated, closeDate: updated.close_date || updated.closeDate } : r))
          );
        }
      } catch (err) {
        console.error("Error updating deal:", err);
      }
      toast.success("Deal updated successfully!");
      addNotification({
        type: "update",
        title: "Deal Updated",
        message: form.name,
      });
    } else {
      try {
        const res = await apiPost("/deals/", payload);
        if (res && res.ok) {
          const newDeal = await res.json();
          setRows((prev) => [{ ...newDeal, closeDate: newDeal.close_date || newDeal.closeDate }, ...prev]);
        }
      } catch (err) {
        console.error("Error creating deal:", err);
      }
      toast.success("Deal created successfully!");
      addNotification({
        type: "create",
        title: "New Deal Created",
        message: form.name,
      });
    }
    setDrawerOpen(false);
    setEditRow(null);
    setForm({ name: "", stage: "", amount: "", owner: [], closeDate: "", priority: "Medium", city: "" });
  };

  const openCreateDrawer = () => {
    setEditRow(null);
    setForm({ name: "", stage: "", amount: "", owner: [], closeDate: "", priority: "Medium", city: "" });
    setDrawerOpen(true);
  };


  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(91, 77, 219);
    doc.text("Deals Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const dataToExport = selected.length > 0 ? rows.filter((r) => selected.includes(r.id)) : filteredRows;

    const tableData = dataToExport.map((r) => [
      r.name,
      r.stage,
      new Date(r.closeDate).toLocaleDateString(),
      r.owner,
      `$${Number(r.amount).toLocaleString()}`,
      r.priority,
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["Deal Name", "Stage", "Close Date", "Owner", "Amount", "Priority"]],
      body: tableData,
      headStyles: {
        fillColor: [91, 77, 219],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 252],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    const filename =
      selected.length > 0
        ? `deals_selected_${new Date().toISOString().slice(0, 10)}.pdf`
        : `deals_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    toast.success(`Exported ${dataToExport.length} deal(s) to PDF`);
  };
  const columns = [
    { id: "name", label: "DEAL NAME", primary: true },
    {
      id: "stage",
      label: "DEAL STAGE",
      render: (row) => {
        const stageColor = STAGE_COLORS[row.stage] || { bg: "#f3f4f6", color: "#6b7280" };
        return <StatusBadge label={row.stage} customColors={stageColor} />;
      },
    },
    {
      id: "closeDate",
      label: "CLOSE DATE",
      render: (row) => new Date(row.closeDate).toLocaleDateString(),
    },
    {
      id: "owner", label: "DEAL OWNER", render: (row) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {Array.isArray(row.owner) ? row.owner.map((o, i) => (
            <Chip key={i} label={o} size="small" sx={{ fontSize: "12px" }} />
          )) : (
            <Typography fontSize="14px" color={COLORS.TEXT_PRIMARY}>{row.owner}</Typography>
          )}
        </Stack>
      )
    },
    {
      id: "amount",
      label: "AMOUNT",
      render: (row) => (
        <Typography fontSize="14px" fontWeight={600} color={COLORS.TEXT_PRIMARY}>
          ${Number(row.amount).toLocaleString()}
        </Typography>
      ),
    },
    {
      id: "priority",
      label: "PRIORITY",
      render: (row) => <StatusBadge label={row.priority} type="priority" />,
    },
    {
      id: "actions",
      label: "ACTIONS",
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setEditRow(row);
                const ownerArr = row.owner ? (Array.isArray(row.owner) ? row.owner : row.owner.split(", ").filter(Boolean)) : [];
                setForm({ ...row, amount: String(row.amount), closeDate: row.closeDate || row.close_date || "", owner: ownerArr });
                setDrawerOpen(true);
              }}
              sx={{
                color: COLORS.TEXT_SECONDARY,
                "&:hover": { color: COLORS.PRIMARY, backgroundColor: "#e0e7ff" },
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
                handleDeleteClick(row.id);
              }}
              sx={{
                color: COLORS.TEXT_SECONDARY,
                "&:hover": { color: COLORS.DELETE, backgroundColor: COLORS.DELETE_BG },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: "16px", md: "24px" },
        marginTop: { xs: "70px", md: "87px" },
        marginLeft: { xs: 0, md: "90px" },
        backgroundColor: COLORS.BG,
        minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 87px)" },
        overflow: "auto",
      }}
    >
      <Sidebar />
      <TopNavbar />


      <PageHeader
        title="Deals"
        subtitle="Manage and track your sales deals"
        actions={
          <>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  const count = selected.length;
                  setRows((prev) => prev.filter((x) => !selected.includes(x.id)));
                  setSelected([]);
                  toast.success(`${count} deal(s) deleted successfully!`);
                }}
                sx={{
                  borderRadius: "10px",
                  borderColor: COLORS.DELETE_BG,
                  backgroundColor: COLORS.DELETE_BG,
                  color: COLORS.DELETE,
                  "&:hover": {
                    borderColor: COLORS.DELETE,
                    backgroundColor: COLORS.DELETE_HOVER,
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
                borderColor: COLORS.BORDER,
                color: COLORS.TEXT_SECONDARY,
                "&:hover": { borderColor: COLORS.PRIMARY, color: COLORS.PRIMARY },
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDrawer}
              sx={{
                background: COLORS.PRIMARY_GRADIENT,
                borderRadius: "10px",
                boxShadow: "0 4px 14px rgba(91, 77, 219, 0.4)",
                "&:hover": {
                  background: COLORS.PRIMARY_GRADIENT_HOVER,
                },
              }}
            >
              Create Deal
            </Button>
          </>
        }
      />


      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search deals by name or owner..."
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            label={`${filteredRows.length} deals`}
            size="small"
            sx={{ backgroundColor: "#e0e7ff", color: COLORS.PRIMARY, fontWeight: 500 }}
          />
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": { borderRadius: "8px" },
              "& .Mui-selected": { backgroundColor: `${COLORS.PRIMARY} !important`, color: "#fff" },
            }}
          />
        </Stack>
      </Stack>


      <Box
        sx={{
          backgroundColor: COLORS.BG_CARD,
          borderRadius: "12px",
          padding: "16px",
          mb: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterListIcon sx={{ color: COLORS.TEXT_MUTED }} />

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
            label="Stage"
            value={filters.stage}
            onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
            sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          >
            <MenuItem value="">All Stages</MenuItem>
            {STAGES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            size="small"
            label="Close Date"
            InputLabelProps={{ shrink: true }}
            value={filters.closeDate}
            onChange={(e) => setFilters({ ...filters, closeDate: e.target.value })}
            sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />

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


      <DataTable
        columns={columns}
        rows={pageRows}
        selected={selected}
        onSelectAll={handleSelectAll}
        onSelect={handleSelect}
        onRowClick={(row) => navigate(`/deals/${row.id}`)}
      />


      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editRow ? "Edit Deal" : "Create Deal"}
        onSave={handleSave}
        saveLabel={editRow ? "Update Deal" : "Create Deal"}
      >
        <Stack spacing={2.5}>
          <FormField
            label="Deal Name"
            placeholder="Enter deal name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <FormField
            label="Deal Stage"
            type="select"
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: e.target.value })}
            options={STAGES}
            required
          />

          <Stack direction="row" spacing={2}>
            <FormField
              label="Amount ($)"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <FormField
              label="Priority"
              type="select"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={PRIORITY}
              required
            />
          </Stack>

          <Autocomplete
            multiple
            options={OWNERS}
            value={form.owner || []}
            onChange={(e, newValue) => setForm({ ...form, owner: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Deal Owner(s) *"
                placeholder="Select owners"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} size="small" {...getTagProps({ index })} />
              ))
            }
          />

          <FormField
            label="City"
            placeholder="Enter city"
            value={form.city || ""}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          <FormField
            label="Close Date"
            type="date"
            value={form.closeDate}
            onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
            required
          />
        </Stack>
      </FormDrawer>


      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle fontWeight={600} color={COLORS.TEXT_PRIMARY}>
          Delete Deal
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete this deal?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            sx={{ borderRadius: "10px", borderColor: COLORS.BORDER }}
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
    </Box>
  );
}
