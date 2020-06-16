import React from "react";
import { Button, ButtonProps, ButtonHTMLProps } from "@rmwc/button";
import "@rmwc/button/styles";
import "./DeleteFooter.css";

type Props = ButtonHTMLProps & ButtonProps;

const DeleteFooter = (props: Props) => {
  return (
    <footer className="delete-footer">
      <Button {...props} outlined>
        Delete
      </Button>
    </footer>
  );
};

export default DeleteFooter;
