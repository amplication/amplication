import { defaultTheme } from "react-admin";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { merge } from "lodash";
import createPalette from "@mui/material/styles/createPalette";

const palette = createPalette(
  merge({}, defaultTheme.palette, {
    primary: {
      main: "#20a4f3",
    },
    secondary: {
      main: "#7950ed",
    },
    error: {
      main: "#e93c51",
    },
    warning: {
      main: "#f6aa50",
    },
    info: {
      main: "#144bc1",
    },
    success: {
      main: "#31c587",
    },
  })
);

const themeOptions: ThemeOptions = {
  palette,
};

export const theme = createTheme(merge({}, defaultTheme, themeOptions));
