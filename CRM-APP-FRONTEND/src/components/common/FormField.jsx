import React from "react";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { COLORS } from "../../theme/constants";


export default function FormField({
    label,
    value,
    onChange,
    type = "text",
    options = [],
    required = false,
    placeholder = "",
    fullWidth = true,
    rows = 3,
    ...rest
}) {
    const inputStyles = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: COLORS.BORDER },
            "&:hover fieldset": { borderColor: COLORS.BORDER_HOVER },
            "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
        },
    };

    if (type === "select") {
        return (
            <FormControl fullWidth={fullWidth} {...rest}>
                <InputLabel>{label}{required && " *"}</InputLabel>
                <Select
                    value={value}
                    label={`${label}${required ? " *" : ""}`}
                    onChange={onChange}
                    sx={{ borderRadius: "10px" }}
                >
                    <MenuItem value="">Select</MenuItem>
                    {options.map((opt) => (
                        <MenuItem key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    return (
        <TextField
            fullWidth={fullWidth}
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            type={type}
            multiline={type === "textarea"}
            rows={type === "textarea" ? rows : undefined}
            sx={inputStyles}
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
            {...rest}
        />
    );
}
