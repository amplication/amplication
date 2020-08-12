import React from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import classNames from "classnames";
import "./Sidebar.scss";

type Props = {
  children: React.ReactNode;
  modal?: boolean;
  open?: boolean;
  showBack?: boolean;
  title?: string;
};

const Sidebar = ({ children, modal, open }: Props) => {
  return (
    <div className={classNames("side-bar", { "side-bar--modal": modal })}>
      <Drawer modal={modal} open={open} dir="rtl" className="side-bar__wrapper">
        <div dir="ltr">{children}</div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
