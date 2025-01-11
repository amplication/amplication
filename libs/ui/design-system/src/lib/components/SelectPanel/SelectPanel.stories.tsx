import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { SelectPanel } from "./SelectPanel";
import { OptionItem } from "../types";
import { EnumButtonStyle } from "../Button/Button";

export default {
  title: "SelectPanel",
  component: SelectPanel,
} as Meta;

const OPTIONS: OptionItem[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const OPTIONS_WITH_COLORS: OptionItem[] = [
  { label: "Option 1", value: "option1", color: "red" },
  { label: "Option 2", value: "option2", color: "green" },
  { label: "Option 3", value: "option3", color: "blue" },
];

export const Default = {
  render: (props: any) => {
    const [selectedValue, setSelectedValue] = useState<
      string | string[] | null
    >(null);

    return (
      <SelectPanel
        label="Select One"
        options={OPTIONS}
        onChange={setSelectedValue}
        selectedValue={selectedValue}
      />
    );
  },
};

export const MultiSelect = {
  render: (props: any) => {
    const [selectedValue, setSelectedValue] = useState<
      string | string[] | null
    >(null);

    return (
      <SelectPanel
        label="Select Multiple"
        options={OPTIONS}
        onChange={setSelectedValue}
        selectedValue={selectedValue}
        isMulti
      />
    );
  },
};

export const CustomButton = {
  render: (props: any) => {
    const [selectedValue, setSelectedValue] = useState<
      string | string[] | null
    >(null);

    return (
      <SelectPanel
        label="Outlined Button"
        options={OPTIONS}
        onChange={setSelectedValue}
        selectedValue={selectedValue}
        buttonProps={{
          icon: "plus",
          buttonStyle: EnumButtonStyle.Outline,
        }}
      />
    );
  },
};

export const WithColors = {
  render: (props: any) => {
    const [selectedValue, setSelectedValue] = useState<
      string | string[] | null
    >(null);

    return (
      <SelectPanel
        label="Colored Items"
        options={OPTIONS_WITH_COLORS}
        onChange={setSelectedValue}
        selectedValue={selectedValue}
      />
    );
  },
};
