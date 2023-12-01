import React from "react";
import { Meta } from "@storybook/react";
import {
  FeatureButton,
  EnumButtonState,
  EnumButtonStyle,
  EnumIconPosition,
} from "./FeatureButton";
import { EnumFlexDirection, FlexItem } from "../FlexItem/FlexItem";

export default {
  title: "FeatureButton",
  component: FeatureButton,
} as Meta;

export const Default = {
  render: (args: any) => {
    return <FeatureButton {...args}>Default FeatureButton</FeatureButton>;
  },
};

export const Primary = {
  render: (args: any) => {
    return (
      <>
        <FlexItem direction={EnumFlexDirection.Column}>
          <FeatureButton buttonStyle={EnumButtonStyle.Primary}>
            Primary{" "}
          </FeatureButton>
          <FeatureButton buttonStyle={EnumButtonStyle.Primary} disabled={true}>
            Primary Disabled
          </FeatureButton>
          <FeatureButton
            buttonStyle={EnumButtonStyle.Primary}
            buttonState={EnumButtonState.Danger}
          >
            Primary Danger
          </FeatureButton>
          <FeatureButton icon="trash_2" buttonStyle={EnumButtonStyle.Primary}>
            Primary With Icon Right
          </FeatureButton>
          <FeatureButton
            icon="trash_2"
            iconPosition={EnumIconPosition.Left}
            buttonStyle={EnumButtonStyle.Primary}
          >
            Primary With Icon Right
          </FeatureButton>
        </FlexItem>
      </>
    );
  },
};

export const Outline = {
  render: (args: any) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        <FeatureButton buttonStyle={EnumButtonStyle.Outline}>
          Outline{" "}
        </FeatureButton>
        <FeatureButton buttonStyle={EnumButtonStyle.Outline} disabled={true}>
          Outline Disabled
        </FeatureButton>
        <FeatureButton
          buttonStyle={EnumButtonStyle.Outline}
          buttonState={EnumButtonState.Danger}
        >
          Outline Danger
        </FeatureButton>
        <FeatureButton icon="trash_2" buttonStyle={EnumButtonStyle.Outline}>
          Outline With Icon Right
        </FeatureButton>
        <FeatureButton
          icon="trash_2"
          iconPosition={EnumIconPosition.Left}
          buttonStyle={EnumButtonStyle.Outline}
        >
          Outline With Icon Left
        </FeatureButton>
      </FlexItem>
    );
  },
};
export const Text = {
  render: (args: any) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        <FeatureButton buttonStyle={EnumButtonStyle.Text}>Text </FeatureButton>
        <FeatureButton buttonStyle={EnumButtonStyle.Text} disabled={true}>
          Text Disabled
        </FeatureButton>
        <FeatureButton
          buttonStyle={EnumButtonStyle.Text}
          buttonState={EnumButtonState.Danger}
        >
          Text Danger
        </FeatureButton>
        <FeatureButton icon="trash_2" buttonStyle={EnumButtonStyle.Text}>
          Text With Icon Right
        </FeatureButton>
        <FeatureButton
          icon="trash_2"
          iconPosition={EnumIconPosition.Left}
          buttonStyle={EnumButtonStyle.Text}
        >
          Text With Icon Left
        </FeatureButton>
      </FlexItem>
    );
  },
};
