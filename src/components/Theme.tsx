import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import { ReactNode } from "react";

import "./Theme.css";

export const theme = extendTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginBottom: theme.spacing(2),
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginBottom: theme.spacing(4),
        }),
      },
    },
  },
});

const Theme = ({ children }: { children: ReactNode }) => {
  return (
    <CssVarsProvider theme={theme}>
      <div data-mui-color-scheme="dark">
        <div className="Theme">{children}</div>
      </div>
    </CssVarsProvider>
  );
};

export default Theme;
