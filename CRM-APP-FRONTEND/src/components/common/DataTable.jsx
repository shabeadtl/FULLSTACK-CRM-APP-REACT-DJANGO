import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    Card,
    Stack,
    Chip,
} from "@mui/material";
import { COLORS } from "../../theme/constants";


export default function DataTable({
    columns,
    rows,
    selected = [],
    onSelectAll,
    onSelect,
    onRowClick,
    idField = "id",
    selectable = true,
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const isAllSelected = rows.length > 0 && selected.length === rows.length;
    const isSomeSelected = selected.length > 0 && selected.length < rows.length;


    if (isMobile) {
        return (
            <Stack spacing={2}>
                {rows.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: "center", borderRadius: "12px" }}>
                        <Typography color="text.secondary">No data found</Typography>
                    </Card>
                ) : (
                    rows.map((row) => {
                        const isItemSelected = selected.includes(row[idField]);
                        return (
                            <Card
                                key={row[idField]}
                                onClick={() => onRowClick && onRowClick(row)}
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    cursor: onRowClick ? "pointer" : "default",
                                    border: isItemSelected ? `2px solid ${COLORS.PRIMARY}` : "1px solid #e2e8f0",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <Stack spacing={1.5}>
                                    {selectable && (
                                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Checkbox
                                                size="small"
                                                checked={isItemSelected}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    onSelect && onSelect(row[idField]);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                sx={{ p: 0, "&.Mui-checked": { color: COLORS.PRIMARY } }}
                                            />
                                        </Box>
                                    )}
                                    {columns.map((col) => (
                                        <Box
                                            key={col.id}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                fontSize="12px"
                                                color="text.secondary"
                                                fontWeight={500}
                                                sx={{ minWidth: 80 }}
                                            >
                                                {col.label}
                                            </Typography>
                                            <Box sx={{ flex: 1, textAlign: "right" }}>
                                                {col.render ? (
                                                    col.render(row)
                                                ) : (
                                                    <Typography
                                                        fontSize="14px"
                                                        color={col.primary ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY}
                                                        fontWeight={col.primary ? 500 : 400}
                                                    >
                                                        {row[col.id]}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>
                        );
                    })
                )}
            </Stack>
        );
    }


    return (
        <Box
            sx={{
                borderRadius: "12px",
                overflow: "auto",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: COLORS.PRIMARY }}>
                    <TableRow>
                        {selectable && (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                                    checked={isAllSelected}
                                    indeterminate={isSomeSelected}
                                    onChange={onSelectAll}
                                />
                            </TableCell>
                        )}
                        {columns.map((col) => (
                            <TableCell
                                key={col.id}
                                sx={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    letterSpacing: "0.5px",
                                    borderBottom: "none",
                                    py: 2,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Typography color="text.secondary">No data found</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => {
                            const isItemSelected = selected.includes(row[idField]);

                            return (
                                <TableRow
                                    key={row[idField]}
                                    hover
                                    selected={isItemSelected}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    sx={{
                                        cursor: onRowClick ? "pointer" : "default",
                                        "&:hover": { backgroundColor: "#f8fafc" },
                                        transition: "background-color 0.15s",
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    onSelect && onSelect(row[idField]);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                sx={{ "&.Mui-checked": { color: COLORS.PRIMARY } }}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((col) => (
                                        <TableCell key={col.id}>
                                            {col.render ? (
                                                col.render(row)
                                            ) : (
                                                <Typography
                                                    fontSize="14px"
                                                    color={
                                                        col.primary ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY
                                                    }
                                                    fontWeight={col.primary ? 500 : 400}
                                                >
                                                    {row[col.id]}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
