import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

type Props = {
  open: boolean;
  children: React.ReactNode;
};

const Sidebar = ({ open, children }: Props) => {
  return (
    <Drawer dir="rtl" open={open} dismissible>
      {children}
    </Drawer>
  );
};

export default Sidebar;
