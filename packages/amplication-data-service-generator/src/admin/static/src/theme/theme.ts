import { defaultTheme } from "react-admin";
import createMuiTheme, {
  ThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
import { merge } from "lodash";
import createPalette from "@material-ui/core/styles/createPalette";

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

export const theme = createMuiTheme(merge({}, defaultTheme, themeOptions));
