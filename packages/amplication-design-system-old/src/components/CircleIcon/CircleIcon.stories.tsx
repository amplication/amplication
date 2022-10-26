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
  return <CircleIcon icon="check" />;
};

export const Primary = () => {
  return <CircleIcon icon="check" style={EnumCircleIconStyle.Primary} />;
};

export const Secondary = () => {
  return <CircleIcon icon="check" style={EnumCircleIconStyle.Secondary} />;
};

export const Positive = () => {
  return <CircleIcon icon="check" style={EnumCircleIconStyle.Positive} />;
};

export const Negative = () => {
  return <CircleIcon icon="check" style={EnumCircleIconStyle.Negative} />;
};

export const Warning = () => {
  return <CircleIcon icon="check" style={EnumCircleIconStyle.Warning} />;
};

export const SmallSize = () => {
  return <CircleIcon icon="check" size={EnumCircleIconSize.Small} />;
};

export const DefaultSize = () => {
  return <CircleIcon icon="check" size={EnumCircleIconSize.Default} />;
};

export const LargeSize = () => {
  return <CircleIcon icon="check" size={EnumCircleIconSize.Large} />;
};
