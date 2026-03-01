import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Checkbox,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FilterListIcon from "@mui/icons-material/FilterList";
import Sidebar from "../../layout/Sidebar";
import TopNavbar from "../../layout/TopNavbar";
import { getCompanies, addCompany, updateCompany, deleteCompany } from "../../services/companyService";
import { COLORS } from "../../theme/constants";
import CreateCompany from "./CreateCompany";


const PRIMARY = COLORS.PRIMARY;
const BG = COLORS.BG;
const BORDER = COLORS.BORDER;

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];


const getStatusColor = (status) => {
    switch (status) {
        case "Active": return { bg: "#d1fae5", color: "#059669" };
        case "Inactive": return { bg: "#fee2e2", color: "#dc2626" };
        case "Pending": return { bg: "#fef3c7", color: "#d97706" };
        default: return { bg: "#f3f4f6", color: "#6b7280" };
    }
};


const EMPTY_FORM = {
    name: "",
    industry: "",
    contact: "",
    email: "",
    phone: "",
    location: "",
    employees: "",
    revenue: "",
    status: "Active",
    website: "",
    description: "",
};

export default function Companies() {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [companies, setCompanies] = useState([]);
    const fileInputRef = useRef(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;


    const [filters, setFilters] = useState({
        status: "",
        industry: "",
    });


    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);


    const [selected, setSelected] = useState([]);


    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        const data = await getCompanies();
        setCompanies(data);
    };


    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return companies.filter((r) => {
            return (
                (!q ||
                    r.name?.toLowerCase().includes(q) ||
                    r.industry?.toLowerCase().includes(q) ||
                    r.contact?.toLowerCase().includes(q) ||
                    r.email?.toLowerCase().includes(q)) &&
                (!filters.status || r.status === filters.status) &&
                (!filters.industry || r.industry?.toLowerCase().includes(filters.industry.toLowerCase()))
            );
        });
    }, [companies, search, filters]);

    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pageRows = filteredRows.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );


    const isSelected = (id) => selected.includes(id);
    const isAllSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));
    const isSomeSelected = pageRows.some((r) => selected.includes(r.id)) && !isAllSelected;

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

    const handleClearSelected = async () => {
        for (const id of selected) {
            await deleteCompany(id);
        }
        await loadCompanies();
        setSelected([]);
        toast.success(`${selected.length} companies deleted`);
        addNotification({
            type: "delete",
            title: "Companies Deleted",
            message: `${selected.length} companies were deleted`,
        });
    };


    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const companyToDelete = companies.find(c => c.id === deleteId);
        await deleteCompany(deleteId);
        await loadCompanies();
        setSelected((prev) => prev.filter((selectedId) => selectedId !== deleteId));
        setConfirmOpen(false);
        setDeleteId(null);
        toast.success("Company deleted successfully!");
        addNotification({
            type: "delete",
            title: "Company Deleted",
            message: companyToDelete?.name || "A company was deleted",
        });
    };


    const handleRowClick = (row) => {
        navigate(`/companies/${row.id}`);
    };


    const openCreateDrawer = () => {
        setEditRow(null);
        setDrawerOpen(true);
    };

    const openEditDrawer = (company, e) => {
        e.stopPropagation();
        setEditRow(company);
        setDrawerOpen(true);
    };


    const handleSaveCompany = async (formData) => {
        if (!formData.name?.trim()) {
            toast.error("Please enter company name");
            return;
        }
        if (!formData.email?.trim()) {
            toast.error("Please enter email");
            return;
        }

        if (editRow) {

            await updateCompany(editRow.id, formData);
            await loadCompanies();
            toast.success("Company updated successfully!");
            addNotification({
                type: "update",
                title: "Company Updated",
                message: formData.name,
            });
        } else {
            await addCompany(formData);
            await loadCompanies();
            toast.success("Company created successfully!");
            addNotification({
                type: "create",
                title: "New Company Created",
                message: formData.name,
            });
        }
        setDrawerOpen(false);
        setEditRow(null);
    };


    const handleExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(91, 77, 219);
        doc.text("Companies Report", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const dataToExport = selected.length > 0
            ? companies.filter(r => selected.includes(r.id))
            : filteredRows;

        const tableData = dataToExport.map(row => [
            row.name,
            row.industry,
            row.contact,
            row.location,
            row.status,
        ]);

        autoTable(doc, {
            startY: 38,
            head: [["Company Name", "Industry", "Contact", "Location", "Status"]],
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
            ? `companies_selected_${new Date().toISOString().slice(0, 10)}.pdf`
            : `companies_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
        toast.success("PDF exported successfully!");
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
                    name: row["name"] || row["company name"] || row["company_name"] || "",
                    industry: row["industry"] || "",
                    contact: row["contact"] || row["contact person"] || row["contact_person"] || "",
                    email: row["email"] || "",
                    phone: row["phone"] || row["phone number"] || row["phone_number"] || "",
                    location: row["location"] || row["address"] || "",
                    status: row["status"] || "Active",
                };

                if (!payload.name) {
                    failed++;
                    continue;
                }

                try {
                    await addCompany(payload);
                    imported++;
                } catch {
                    failed++;
                }
            }

            await loadCompanies();
            toast.success(`Imported ${imported} companies${failed > 0 ? `, ${failed} failed` : ""}`);
            addNotification({
                type: "create",
                title: "Companies Imported",
                message: `${imported} companies imported from CSV`,
            });
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    return (
        <Box
            sx={{
                padding: "24px",
                marginTop: "87px",
                marginLeft: "90px",
                backgroundColor: BG,
                minHeight: "calc(100vh - 87px)",
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


            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="#1e293b">
                        Companies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your company accounts
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
                        startIcon={<FileUploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            borderRadius: "10px",
                            borderColor: BORDER,
                            color: "#64748b",
                            "&:hover": { borderColor: PRIMARY, color: PRIMARY },
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
                        Create Company
                    </Button>
                </Stack>
            </Stack>


            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    size="small"
                    placeholder="Search companies by name, industry, contact..."
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
                        label={`${filteredRows.length} companies`}
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
                        select
                        size="small"
                        label="Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    >
                        <MenuItem value="">All Status</MenuItem>
                        {STATUS_OPTIONS.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        size="small"
                        label="Industry"
                        placeholder="Filter by industry"
                        value={filters.industry}
                        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                        sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                            {["COMPANY NAME", "INDUSTRY", "CONTACT", "LOCATION", "STATUS", "ACTIONS"].map((h) => (
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
                                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary">No companies found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageRows.map((r) => {
                                const isItemSelected = isSelected(r.id);
                                const statusStyle = getStatusColor(r.status || "Active");

                                return (
                                    <TableRow
                                        key={r.id}
                                        hover
                                        selected={isItemSelected}
                                        onClick={() => handleRowClick(r)}
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": { backgroundColor: "#f8fafc" },
                                            transition: "background-color 0.15s",
                                        }}
                                    >
                                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isItemSelected}
                                                onChange={() => handleSelect(r.id)}
                                                sx={{
                                                    color: "#cbd5e1",
                                                    "&.Mui-checked": { color: PRIMARY },
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={600} color="#1e293b" fontSize="14px">
                                                {r.name}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography color="#64748b" fontSize="13px">
                                                {r.industry || "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography color="#64748b" fontSize="13px">
                                                {r.contact || "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography color="#64748b" fontSize="13px">
                                                {r.location || "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={r.status || "Active"}
                                                size="small"
                                                sx={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontWeight: 600,
                                                    fontSize: "11px",
                                                    borderRadius: "6px",
                                                    height: "24px",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => openEditDrawer(r, e)}
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
                                                        onClick={(e) => handleDeleteClick(r.id, e)}
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


            <CreateCompany
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSave={handleSaveCompany}
                editData={editRow}
            />


            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
            >
                <DialogTitle fontWeight={600} color="#1e293b">
                    Delete Company
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to delete this company?
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
        </Box>
    );
}
