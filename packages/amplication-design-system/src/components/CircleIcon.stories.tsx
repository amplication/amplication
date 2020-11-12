import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import CircleIcon, {
  EnumCircleIconSize,
  EnumCircleIconStyle,
} from "./CircleIcon";

export default {
  title: "CircleIcon",
  component: CircleIcon,
} as Meta;

export const Default = () => {
  return <CircleIcon icon="insert_emoticon" />;
};

export const Primary = () => {
  return (
    <CircleIcon icon="insert_emoticon" style={EnumCircleIconStyle.Primary} />
  );
};

export const Secondary = () => {
  return (
    <CircleIcon icon="insert_emoticon" style={EnumCircleIconStyle.Secondary} />
  );
};

export const Positive = () => {
  return (
    <CircleIcon icon="insert_emoticon" style={EnumCircleIconStyle.Positive} />
  );
};

export const Negative = () => {
  return (
    <CircleIcon icon="insert_emoticon" style={EnumCircleIconStyle.Negative} />
  );
};

export const Warning = () => {
  return (
    <CircleIcon icon="insert_emoticon" style={EnumCircleIconStyle.Warning} />
  );
};

export const SmallSize = () => {
  return <CircleIcon icon="insert_emoticon" size={EnumCircleIconSize.Small} />;
};

export const DefaultSize = () => {
  return (
    <CircleIcon icon="insert_emoticon" size={EnumCircleIconSize.Default} />
  );
};

export const LargeSize = () => {
  return <CircleIcon icon="insert_emoticon" size={EnumCircleIconSize.Large} />;
};
