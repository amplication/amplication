import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
} from "@mui/material";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { EnumTextColor } from "../Text/Text";
import "./Tabs.scss";

export enum EnumTabsStyle {
  Default = "default",
  Header = "header",
  Inner = "inner",
}

export type Props = MuiTabsProps & {
  tabsStyle?: EnumTabsStyle;
};

export const Tabs = ({
  children,
  tabsStyle = EnumTabsStyle.Default,
}: Props) => {
  return (
    <MuiTabs
      value={false}
      className={classNames("amp-tabs", `amp-tabs--${tabsStyle}`)}
    >
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
  indicatorValue?: string | number;
  indicatorColor?: EnumTextColor;
  disabled?: boolean;
  lockedFeatureIndicator?: React.ReactNode;
};

export type TabProps = Omit<MuiTabProps, "label"> & TabItem;

function Tab(props: TabProps) {
  const {
    to,
    exact,
    iconName,
    name,
    indicatorColor,
    indicatorValue,
    disabled,
    lockedFeatureIndicator,
    ...rest
  } = props;

  const colorStyle = indicatorColor && {
    backgroundColor: `var(--${indicatorColor})`,
  };

  const label = (
    <>
      {name}
      {indicatorValue && (
        <span style={colorStyle} className="amp-tab__indicator">
          {indicatorValue}
        </span>
      )}
    </>
  );

  return (
    <MuiTab
      className="amp-tab"
      component={NavLink}
      classes={{ selected: "amp-tab--selected" }}
      to={to}
      label={label}
      disableRipple
      {...rest}
      exact={exact}
    />
  );
}

Tabs.Tab = Tab;
