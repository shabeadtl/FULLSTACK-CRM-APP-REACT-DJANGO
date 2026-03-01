import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "../../theme/constants";


export default function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    width = 350,
}) {
    return (
        <TextField
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            sx={{
                width,
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: COLORS.BORDER },
                    "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                    "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: COLORS.TEXT_MUTED }} />
                    </InputAdornment>
                ),
            }}
        />
    );
}
