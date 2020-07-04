import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import "./Sidebar.scss";

type Props = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
  return <Drawer className="side-bar">{children}</Drawer>;
};

export default Sidebar;
