import React from "react";
import { Meta } from "@storybook/react";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "./SelectMenu";

import { EnumButtonStyle } from "../Button/Button";

export default {
  title: "SelectMenu",
  argTypes: { onSelectionChange: { action: "selectionChanged" } },
  component: SelectMenu,
} as Meta;

const ITEMS = ["Item 1", "Item 2", "Item 3", "Item 4"];

export const Default = {
  render: (props: any) => {
    return (
      <SelectMenu title="Create New" icon="plus">
        <SelectMenuModal>
          <SelectMenuList>
            {ITEMS.map((item) => (
              <SelectMenuItem
                key={item}
                onSelectionChange={props.onSelectionChange}
                itemData={{
                  value: item,
                }}
              >
                {item}
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    );
  },
};

export const Secondary = {
  render: (props: any) => {
    return (
      <SelectMenu
        title="Create New"
        buttonStyle={EnumButtonStyle.Text}
        icon="plus"
      >
        <SelectMenuModal>
          <SelectMenuList>
            {ITEMS.map((item) => (
              <SelectMenuItem
                key={item}
                onSelectionChange={props.onSelectionChange}
                itemData={{
                  value: item,
                }}
              >
                {item}
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    );
  },
};

export const Clear = {
  render: (props: any) => {
    return (
      <SelectMenu
        title="Create New"
        buttonStyle={EnumButtonStyle.Text}
        icon="plus"
      >
        <SelectMenuModal>
          <SelectMenuList>
            {ITEMS.map((item) => (
              <SelectMenuItem
                key={item}
                onSelectionChange={props.onSelectionChange}
                itemData={{
                  value: item,
                }}
              >
                {item}
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    );
  },
};

export const WithoutIcon = {
  render: (props: any) => {
    return (
      <SelectMenu title="Create New" buttonStyle={EnumButtonStyle.Outline}>
        <SelectMenuModal>
          <SelectMenuList>
            {ITEMS.map((item) => (
              <SelectMenuItem
                key={item}
                onSelectionChange={props.onSelectionChange}
                itemData={{
                  value: item,
                }}
              >
                {item}
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    );
  },
};
