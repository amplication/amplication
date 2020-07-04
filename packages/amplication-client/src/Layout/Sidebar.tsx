import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import "./Sidebar.scss";

type Props = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
  return (
    <div className="side-bar">
      {" "}
      <Drawer>{children}</Drawer>
    </div>
  );
};

export default Sidebar;
