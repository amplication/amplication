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
  largeMode?: boolean;
};

const Sidebar = ({ children, modal, open, largeMode }: Props) => {
  return (
    <div className={classNames("side-bar", { "side-bar--modal": modal })}>
      {/* we need to use dir=rtl in order to place the sidebar on the right side without loosing the built in animation for opening and closing  */}
      <Drawer
        modal={modal}
        open={open}
        dir="rtl"
        className={classNames("side-bar__wrapper", {
          "side-bar__wrapper--large": largeMode,
        })}
      >
        <div dir="ltr" className="side-bar__inner-wrapper">
          {children}
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
