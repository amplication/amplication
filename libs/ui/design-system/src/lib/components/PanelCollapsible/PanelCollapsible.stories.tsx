import React from "react";
import { Meta } from "@storybook/react";
import { PanelCollapsible } from "./PanelCollapsible";

export default {
  title: "PanelCollapsible",
  argTypes: { onCollapseChange: { action: "collapseChange" } },
  component: PanelCollapsible,
} as Meta;

export const Default = (props: any) => {
  return (
    <PanelCollapsible
      headerContent="Header"
      onCollapseChange={props.onCollapseChange}
      {...props}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </PanelCollapsible>
  );
};

export const InitiallyOpen = (props: any) => {
  return (
    <PanelCollapsible
      initiallyOpen
      headerContent="Header"
      onCollapseChange={props.onCollapseChange}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </PanelCollapsible>
  );
};

export const manualCollapseDisabled = (props: any) => {
  return (
    <>
      <PanelCollapsible
        manualCollapseDisabled
        headerContent="Header"
        onCollapseChange={props.onCollapseChange}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </PanelCollapsible>
      <PanelCollapsible
        initiallyOpen
        manualCollapseDisabled
        headerContent="Header"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </PanelCollapsible>
    </>
  );
};
