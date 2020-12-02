import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "./SelectMenu";

import Provider from "../../components/Provider";

import { EnumButtonStyle } from "../Button";

export default {
  title: "SelectMenu",
  argTypes: { onSelectionChange: { action: "selectionChanged" } },
  component: SelectMenu,
} as Meta;

const ITEMS = ["Item 1", "Item 2", "Item 3", "Item 4"];

export const Default = (props) => {
  return (
    <Provider>
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
    </Provider>
  );
};

export const Secondary = (props) => {
  return (
    <Provider>
      <SelectMenu
        title="Create New"
        buttonStyle={EnumButtonStyle.Secondary}
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
    </Provider>
  );
};

export const Clear = (props) => {
  return (
    <Provider>
      <SelectMenu
        title="Create New"
        buttonStyle={EnumButtonStyle.Clear}
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
    </Provider>
  );
};

export const WithoutIcon = (props) => {
  return (
    <Provider>
      <SelectMenu title="Create New" buttonStyle={EnumButtonStyle.Secondary}>
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
    </Provider>
  );
};
