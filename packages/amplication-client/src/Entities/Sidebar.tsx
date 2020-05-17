import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import "./Sidebar.css";

type Props = {
  open: boolean;
  children: React.ReactNode;
};

const Sidebar = ({ open, children }: Props) => {
  return (
    <Drawer open={open} dismissible>
      {children}
    </Drawer>
  );
};

export default Sidebar;
