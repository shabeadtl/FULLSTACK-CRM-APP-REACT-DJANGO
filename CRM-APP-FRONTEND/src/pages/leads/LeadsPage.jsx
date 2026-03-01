import React, { useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNotifications } from "../../context/NotificationContext";
import {
    Box,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Button,
    Pagination,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FilterListIcon from "@mui/icons-material/FilterList";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import CreateLead from "./CreateLead";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadsContext";


import { COLORS } from "../../theme/constants";
import { PageHeader, SearchBar, DataTable, StatusBadge } from "../../components/common";

export default function LeadsPage() {
    const navigate = useNavigate();
    const { leads, addLead, updateLead, deleteLead, STATUS_COLORS } = useLeads();
    const { addNotification } = useNotifications();

    const fileInputRef = useRef(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;


    const [filters, setFilters] = useState({
        status: "",
        created: "",
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editData, setEditData] = useState(null);


    const [selected, setSelected] = useState([]);


    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return leads.filter((r) => {
            return (
                (!q ||
                    r.name.toLowerCase().includes(q) ||
                    r.email.toLowerCase().includes(q) ||
                    r.phone.includes(q)) &&
                (!filters.status || r.status === filters.status) &&
                (!filters.created || r.created.includes(filters.created))
            );
        });
    }, [leads, search, filters]);

    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pageRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );


    const handleSelectAll = (e) => {
        if (e.target.checked) {
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
        if (selected.includes(id)) {
            setSelected(selected.filter((s) => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        const leadToDelete = leads.find(l => l.id === deleteId);
        deleteLead(deleteId);
        setSelected((prev) => prev.filter((selectedId) => selectedId !== deleteId));
        setConfirmOpen(false);
        setDeleteId(null);
        toast.success("Lead deleted successfully!");
        addNotification({
            type: "delete",
            title: "Lead Deleted",
            message: leadToDelete?.name || "A lead was deleted",
        });
    };

    const handleEdit = (lead, e) => {
        e.stopPropagation();
        setEditData({
            firstName: lead.first_name || lead.name?.split(" ")[0] || "",
            lastName: lead.last_name || lead.name?.split(" ").slice(1).join(" ") || "",
            email: lead.email,
            phone: lead.phone,
            title: lead.title,
            owner: lead.owner,
            status: lead.status,
            id: lead.id,
        });
        setDrawerOpen(true);
    };

    const handleSave = (formData) => {
        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone || "",
            title: formData.title || "",
            owner: formData.owner || "",
            status: formData.status || "New",
        };

        if (editData) {
            updateLead(editData.id, payload);
            toast.success("Lead updated successfully!");
            addNotification({
                type: "update",
                title: "Lead Updated",
                message: `${formData.firstName} ${formData.lastName}`,
            });
        } else {
            addLead(payload);
            toast.success("Lead created successfully!");
            addNotification({
                type: "create",
                title: "New Lead Created",
                message: `${formData.firstName} ${formData.lastName}`,
            });
        }
        setDrawerOpen(false);
        setEditData(null);
    };

    const handleRowClick = (row) => {
        navigate(`/leads/${row.id}`);
    };

    const handleExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(91, 77, 219);
        doc.text("Leads Report", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const dataToExport = selected.length > 0
            ? leads.filter(r => selected.includes(r.id))
            : filteredRows;

        const tableData = dataToExport.map(row => [
            row.name,
            row.email,
            row.phone,
            row.status,
            row.created,
        ]);

        autoTable(doc, {
            startY: 38,
            head: [["Name", "Email", "Phone", "Status", "Created Date"]],
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
            ? `leads_selected_${new Date().toISOString().slice(0, 10)}.pdf`
            : `leads_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
    };
    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim());
            if (lines.length < 2) {
                toast.error("CSV file is empty or has no data rows");
                return;
            }
            const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/["']/g, ""));

            let imported = 0;
            let failed = 0;

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
                const row = {};
                headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
                const payload = {
                    first_name: row["first_name"] || row["first name"] || row["firstname"] || "",
                    last_name: row["last_name"] || row["last name"] || row["lastname"] || "",
                    email: row["email"] || "",
                    phone: row["phone"] || row["phone number"] || row["phone_number"] || "",
                    title: row["title"] || row["job title"] || row["job_title"] || "",
                    owner: row["owner"] || row["contact owner"] || row["contact_owner"] || "",
                    status: row["status"] || row["lead status"] || row["lead_status"] || "New",
                };

                if (!payload.first_name && !payload.last_name) {
                    failed++;
                    continue;
                }

                try {
                    await addLead(payload);
                    imported++;
                } catch {
                    failed++;
                }
            }

            toast.success(`Imported ${imported} leads${failed > 0 ? `, ${failed} failed` : ""}`);
            addNotification({
                type: "create",
                title: "Leads Imported",
                message: `${imported} leads imported from CSV`,
            });
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const columns = [
        { id: "name", label: "NAME", primary: true },
        { id: "email", label: "EMAIL" },
        { id: "phone", label: "PHONE NUMBER" },
        { id: "created", label: "CREATED DATE" },
        {
            id: "status",
            label: "LEAD STATUS",
            render: (row) => (
                <StatusBadge label={row.status} type="lead-status" />
            ),
        },
        {
            id: "actions",
            label: "ACTIONS",
            render: (row) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={(e) => handleEdit(row, e)}
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
                            onClick={(e) => handleDeleteClick(row.id, e)}
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
            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleImportCSV}
            />


            <PageHeader
                title="Leads"
                subtitle="Manage and track your sales leads"
                actions={
                    <>
                        {selected.length > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                    const count = selected.length;
                                    selected.forEach(id => deleteLead(id));
                                    setSelected([]);
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
                            startIcon={<FileUploadIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                borderRadius: "10px",
                                borderColor: COLORS.BORDER,
                                color: COLORS.TEXT_SECONDARY,
                                "&:hover": { borderColor: COLORS.PRIMARY, color: COLORS.PRIMARY },
                            }}
                        >
                            Import
                        </Button>
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
                            onClick={() => {
                                setEditData(null);
                                setDrawerOpen(true);
                            }}
                            sx={{
                                background: COLORS.PRIMARY_GRADIENT,
                                borderRadius: "10px",
                                boxShadow: "0 4px 14px rgba(91, 77, 219, 0.4)",
                                "&:hover": {
                                    background: COLORS.PRIMARY_GRADIENT_HOVER,
                                },
                            }}
                        >
                            Create Lead
                        </Button>
                    </>
                }
            />


            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={{ xs: 2, sm: 0 }}
                mb={2}
            >
                <SearchBar
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search leads by name, email, phone..."
                />
                <Stack direction="row" alignItems="center" spacing={2} justifyContent={{ xs: "space-between", sm: "flex-end" }}>
                    <Chip
                        label={`${filteredRows.length} leads`}
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
                        select
                        size="small"
                        label="Lead Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    >
                        <MenuItem value="">All Status</MenuItem>
                        {Object.keys(STATUS_COLORS).map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
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
                </Stack>
            </Box>


            <DataTable
                columns={columns}
                rows={pageRows}
                selected={selected}
                onSelectAll={handleSelectAll}
                onSelect={handleSelect}
                onRowClick={handleRowClick}
            />


            <CreateLead
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSave={handleSave}
                editData={editData}
            />


            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
            >
                <DialogTitle fontWeight={600} color={COLORS.TEXT_PRIMARY}>
                    Delete Lead
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to delete this lead?
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
