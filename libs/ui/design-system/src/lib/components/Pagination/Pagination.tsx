import {
  createTheme,
  Pagination as MuiPagination,
  PaginationProps,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import "./Pagination.scss";

type Props = PaginationProps;

const CLASS_NAME = "amp-pagination";
export const Pagination = (props: Props) => {
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButtonGroup: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });

  return (
    <div className={CLASS_NAME}>
      <MuiThemeProvider theme={theme}>
        <MuiPagination shape="rounded" size="small" {...props} />
      </MuiThemeProvider>
    </div>
  );
};
