const primaryColor = "#1F2336";
const white = "FFFFFF";
const primaryTextColor = "#0C0404";
const dropdownBorderStyle = "1px solid #2c3249";
const ncWidth = "350px";

const styles = {
  bellButton: {
    root: {
      marginTop: "4px",
      svg: {
        color: white,
        fill: primaryColor,
        minWidth: "15px",
        minHeight: "15px",
      },
    },
    dot: {
      rect: {
        fill: "#A787FF",
        strokeWidth: "0",
        width: "8px",
        height: "8px",
        x: 7,
        y: 4,
      },
    },
  },
  unseenBadge: {
    root: { color: "#15192C", background: "#A787FF", fontWeight: "normal" },
  },
  popover: {
    root: { zIndex: -99 },
    arrow: {
      border: dropdownBorderStyle,
      backgroundColor: "transparent",
      borderLeftColor: "transparent",
      borderTopColor: "transparent",
    },
    dropdown: {
      border: dropdownBorderStyle,
      borderRadius: "10px",
      marginTop: "30px",
      maxWidth: ncWidth,
    },
  },
  header: {
    root: {
      backgroundColor: primaryColor,
      "&:hover": { backgroundColor: primaryColor },
      cursor: "pointer",
      color: primaryTextColor,
      padding: "8px",
      height: "24px",
    },
    cog: { opacity: 1, width: "16px" },
    markAsRead: {
      color: white,
      fontSize: "12px",
    },
    title: {
      color: white,
      fontSize: "14px",
      fontWeight: "500",
    },
  },
  layout: {
    root: {
      background: primaryColor,
      maxWidth: ncWidth,
      padding: "16px",
    },
  },
  loader: {
    root: {
      stroke: "#A787FF",
    },
  },
  notifications: {
    root: {
      ".nc-notifications-list-item": {
        backgroundColor: "#2C3249",
        border: dropdownBorderStyle,
        margin: "10px 8px",
      },
      ".nc-notifications-list-item-unread": {
        backgroundColor: primaryColor,
      },
    },
    listItem: {
      layout: {
        borderRadius: "7px",
        color: white,
        fontSize: "12px",
        fontWeight: "normal",
        "div:has(> .mantine-Avatar-root)": {
          border: "none",
          width: "20px",
          height: "20px",
          minWidth: "20px",
        },
        ".mantine-Avatar-root": {
          width: "20px",
          height: "20px",
          minWidth: "20px",
        },
        ".mantine-Avatar-image": {
          width: "20px",
          height: "20px",
          minWidth: "20px",
        },
      },
      timestamp: { color: "#A3A8B8", fontSize: "10px" },
      dotsButton: {
        path: {
          fill: "#A787FF",
        },
      },
      unread: {
        "::before": { background: "#A787FF" },
      },
      buttons: {
        primary: {
          background: primaryColor,
          color: "FFFFFF",
          border: "1px solid #FFFFFF",
          borderRadius: "3px",
          width: "auto",
          fontWeight: "300",
          "&:hover": {
            background: primaryColor,
            borderColor: "#b7bac7",
            color: "#b7bac7",
          },
        },
      },
    },
  },
};

export default styles;
