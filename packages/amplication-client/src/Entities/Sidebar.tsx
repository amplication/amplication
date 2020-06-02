import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import "./Sidebar.css";

type Props = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
  return <Drawer>{children}</Drawer>;
};

export default Sidebar;
