import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import MainLayout from "./MainLayout";
import { Menu } from "../Menu/Menu";
import { CircleBadge } from "../CircleBadge/CircleBadge";
import { Panel, PanelHeader } from "../Panel/Panel";
import Page from "../Page/Page";

export default {
  title: "MainLayout",
  component: MainLayout,
} as Meta;

export const Default = (props: any) => {
  return (
    <MainLayout>
      <MainLayout.Content />
    </MainLayout>
  );
};

export const WithMenu = (props: any) => {
  return (
    <MainLayout>
      <Menu
        onSignOutClick={props.onSignOutClick}
        logoContent={<CircleBadge name="Amplication" />}
      />
      <MainLayout.Content />
    </MainLayout>
  );
};

export const WithPageContent = (props: any) => {
  return (
    <MainLayout>
      <Menu
        onSignOutClick={props.onSignOutClick}
        logoContent={<CircleBadge name="Amplication" />}
      />
      <MainLayout.Content>
        <Page>
          <Panel>
            <PanelHeader>Header</PanelHeader>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Panel>
        </Page>
      </MainLayout.Content>
    </MainLayout>
  );
};
