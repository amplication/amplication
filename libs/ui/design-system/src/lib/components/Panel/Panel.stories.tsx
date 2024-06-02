import React from "react";
import { Meta } from "@storybook/react";
import { Panel, EnumPanelStyle, PanelHeader } from "./Panel";
import { Button, EnumButtonStyle } from "../Button/Button";
import { EnumTextColor, Text } from "../Text/Text";
import { FlexItem } from "../FlexItem/FlexItem";

export default {
  title: "Panel",
  component: Panel,
  argTypes: {
    clickable: {
      control: "boolean",
    },
    onClick: { action: "click", if: { arg: "clickable" } },
    panelStyle: {
      control: "inline-radio",
      options: EnumPanelStyle,
    },
    themeColor: {
      control: "inline-radio",
      options: EnumTextColor,
    },
    shadow: {
      control: "boolean",
    },
  },
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <>
        <Panel {...props}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Panel>
        <Panel {...props}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Panel>
      </>
    );
  },
};

export const WithStringHeader = {
  render: (props: any) => {
    return (
      <>
        <Panel {...props}>
          <PanelHeader>Default Panel Header</PanelHeader>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Panel>
        <Panel {...props} panelStyle={EnumPanelStyle.Bordered}>
          <PanelHeader>Bordered Panel Header</PanelHeader>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Panel>
        <Panel {...props} panelStyle={EnumPanelStyle.Transparent}>
          <PanelHeader>Transparent Panel Header</PanelHeader>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Panel>
      </>
    );
  },
};

export const WithContentHeader = {
  render: (props: any) => {
    return (
      <Panel {...props}>
        <PanelHeader>
          <h3>Panel Title</h3>
          <Button buttonStyle={EnumButtonStyle.Text} icon="edit" />
        </PanelHeader>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Panel>
    );
  },
};

export const WithNonClickableFooter = {
  render: (props: any) => {
    return (
      <Panel
        {...props}
        clickable
        nonClickableFooter={
          <FlexItem
            end={
              <Text textColor={EnumTextColor.ThemeTurquoise}>
                Non-Clickable Footer
              </Text>
            }
          ></FlexItem>
        }
      >
        <PanelHeader>
          <h3>Panel Title</h3>
          <Button buttonStyle={EnumButtonStyle.Text} icon="edit" />
        </PanelHeader>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Panel>
    );
  },
};
