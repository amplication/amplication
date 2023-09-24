import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import "./Tabs.scss";
import { EnumTextColor } from "../Text/Text";

export type Props = MuiTabsProps;

export const Tabs = ({ children }: Props) => {
  return (
    <MuiTabs value={false} className="amp-tabs">
      {children}
    </MuiTabs>
  );
};

export default Tabs;

export type TabItem = {
  name: string;
  to: string;
  exact: boolean;
  iconName?: string;
  indicatorValue?: string;
  indicatorColor?: EnumTextColor;
};

export type TabProps = Omit<MuiTabProps, "label"> & TabItem;

function Tab(props: TabProps) {
  const { to, exact, iconName, name, indicatorColor, indicatorValue, ...rest } =
    props;

  const label = indicatorValue ? `${name} (${indicatorValue})` : name;

  return (
    <MuiTab
      className="amp-tab"
      component={NavLink}
      classes={{ selected: "amp-tab--selected" }}
      // icon={iconName && <Icon size={"small"} icon={iconName} />}
      to={to}
      label={label}
      disableRipple
      {...rest}
      exact={exact}
    />
  );
}

Tabs.Tab = Tab;
