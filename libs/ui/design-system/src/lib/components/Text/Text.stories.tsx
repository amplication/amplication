import React from "react";
import { Meta } from "@storybook/react";
import { Text, EnumTextStyle, EnumTextColor, EnumTextWeight } from "./Text";

export default {
  title: "Text",
  component: Text,
} as Meta;

export const Default = (props: any) => {
  return (
    <>
      <Text {...props}>Normal text</Text>
    </>
  );
};

export const WithColorAndWeight = (props: any) => {
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

export const H1 = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.H1}>Header 1</Text>
    </>
  );
};

export const H2 = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.H2}>Header 2</Text>
    </>
  );
};

export const H3 = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.H3}>Header 3</Text>
    </>
  );
};

export const H4 = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.H4}>Header 4</Text>
    </>
  );
};

export const Subtle = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Subtle}>Subtle text</Text>
    </>
  );
};

export const Tag = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Tag}>Tag text</Text>
    </>
  );
};

export const Description = (props: any) => {
  return (
    <>
      <Text textStyle={EnumTextStyle.Description}>Description text</Text>
    </>
  );
};
