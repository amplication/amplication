import React from "react";
import { Meta } from "@storybook/react";
import { Text, EnumTextStyle, EnumTextColor, EnumTextWeight } from "./Text";

export default {
  title: "Text",
  component: Text,
} as Meta;

export const Default = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Normal}>Normal text</Text>
    </>
  );
};

export const WithColorAndWeight = () => {
  return (
    <>
      <Text
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.ThemeBlue}
        textWeight={EnumTextWeight.SemiBold}
      >
        Semi-bold green text
      </Text>
    </>
  );
};

export const H1 = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Normal}>Header 1</Text>
    </>
  );
};

export const H2 = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Normal}>Header 2</Text>
    </>
  );
};

export const H3 = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Normal}>Header 3</Text>
    </>
  );
};

export const Subtle = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Subtle}>Subtle text</Text>
    </>
  );
};

export const Tag = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Tag}>Tag text</Text>
    </>
  );
};
