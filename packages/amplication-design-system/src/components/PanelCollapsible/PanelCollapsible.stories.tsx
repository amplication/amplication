import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { PanelCollapsible } from "./PanelCollapsible";
import Provider from "../../components/Provider";

export default {
  title: "PanelCollapsible",
  argTypes: { onCollapseChange: { action: "collapseChange" } },
  component: PanelCollapsible,
} as Meta;

export const Default = (props: any) => {
  return (
    <Provider>
      <PanelCollapsible headerContent="Header">
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
    </Provider>
  );
};

export const InitiallyOpen = (props: any) => {
  return (
    <Provider>
      <PanelCollapsible initiallyOpen headerContent="Header">
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
    </Provider>
  );
};

export const manualCollapseDisabled = (props: any) => {
  return (
    <Provider>
      <>
        <PanelCollapsible manualCollapseDisabled headerContent="Header">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
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
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </PanelCollapsible>
      </>
    </Provider>
  );
};
