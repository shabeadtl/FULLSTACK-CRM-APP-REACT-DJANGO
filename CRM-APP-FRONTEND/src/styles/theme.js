import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

export default appTheme;
