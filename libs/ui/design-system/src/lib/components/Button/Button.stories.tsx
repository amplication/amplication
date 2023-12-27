import React from "react";
import { Meta } from "@storybook/react";
import {
  Button,
  EnumButtonState,
  EnumButtonStyle,
  EnumIconPosition,
} from "./Button";
import { EnumFlexDirection, FlexItem } from "../FlexItem/FlexItem";

export default {
  title: "Button",
  component: Button,
} as Meta;

export const Default = {
  render: (args: any) => {
    return <Button {...args}>Default Button</Button>;
  },
};

export const Primary = {
  render: (args: any) => {
    return (
      <>
        <FlexItem direction={EnumFlexDirection.Column}>
          <Button buttonStyle={EnumButtonStyle.Primary}>Primary </Button>
          <Button buttonStyle={EnumButtonStyle.Primary} disabled={true}>
            Primary Disabled
          </Button>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            buttonState={EnumButtonState.Danger}
          >
            Primary Danger
          </Button>
          <Button icon="trash_2" buttonStyle={EnumButtonStyle.Primary}>
            Primary With Icon Right
          </Button>
          <Button
            icon="trash_2"
            iconPosition={EnumIconPosition.Left}
            buttonStyle={EnumButtonStyle.Primary}
          >
            Primary With Icon Right
          </Button>
        </FlexItem>
      </>
    );
  },
};

export const Outline = {
  render: (args: any) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        <Button buttonStyle={EnumButtonStyle.Outline}>Outline </Button>
        <Button buttonStyle={EnumButtonStyle.Outline} disabled={true}>
          Outline Disabled
        </Button>
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          buttonState={EnumButtonState.Danger}
        >
          Outline Danger
        </Button>
        <Button icon="trash_2" buttonStyle={EnumButtonStyle.Outline}>
          Outline With Icon Right
        </Button>
        <Button
          icon="trash_2"
          iconPosition={EnumIconPosition.Left}
          buttonStyle={EnumButtonStyle.Outline}
        >
          Outline With Icon Left
        </Button>
      </FlexItem>
    );
  },
};
export const Text = {
  render: (args: any) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        <Button buttonStyle={EnumButtonStyle.Text}>Text </Button>
        <Button buttonStyle={EnumButtonStyle.Text} disabled={true}>
          Text Disabled
        </Button>
        <Button
          buttonStyle={EnumButtonStyle.Text}
          buttonState={EnumButtonState.Danger}
        >
          Text Danger
        </Button>
        <Button icon="trash_2" buttonStyle={EnumButtonStyle.Text}>
          Text With Icon Right
        </Button>
        <Button
          icon="trash_2"
          iconPosition={EnumIconPosition.Left}
          buttonStyle={EnumButtonStyle.Text}
        >
          Text With Icon Left
        </Button>
      </FlexItem>
    );
  },
};
