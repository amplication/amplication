import {
  Button,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { REACT_APP_SHOW_CONFETTI } from "../env";
import "./CompletePreviewSignup.scss";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

const CLASS_NAME = "complete-preview-signup";
const showConfetti = REACT_APP_SHOW_CONFETTI === "true";

type Props = {
  onConfirm: () => void;
};

export const CompletePreviewSignup: React.FC<Props> = ({ onConfirm }) => {
  return (
    <FlexItem
      direction={EnumFlexDirection.Column}
      className={CLASS_NAME}
      itemsAlign={EnumItemsAlign.Center}
      contentAlign={EnumContentAlign.Center}
      gap={EnumGapSize.XLarge}
    >
      <Text textStyle={EnumTextStyle.H1}>
        Unleash the Magic of Amplication!
        <span role="img" aria-label="celebrate">
          {" "}
          🎉
        </span>
      </Text>
      {showConfetti && <Realistic autorun={{ speed: 1, duration: 7 }} />}
      <Text textAlign={EnumTextAlign.Center} textStyle={EnumTextStyle.Normal}>
        <Text>
          We're thrilled for the monumental leap you've taken with Amplication!
        </Text>
        <br />
        <Text>
          By initiating this journey, you've sparked an innovative
          transformation in your backend code generation.{" "}
        </Text>
      </Text>
      <Text textAlign={EnumTextAlign.Center} textStyle={EnumTextStyle.Normal}>
        <Text
          textAlign={EnumTextAlign.Center}
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.White}
        >
          But our adventure doesn't stop here! Your next move is crucial:{" "}
        </Text>
        <br />
        <Text
          textAlign={EnumTextAlign.Center}
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.Primary}
        >
          Follow the signup process in your email{" "}
        </Text>
        <Text
          textAlign={EnumTextAlign.Center}
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.White}
        >
          to set your password.
        </Text>
        <br />
        <Text
          textAlign={EnumTextAlign.Center}
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.White}
        >
          If you're already an Amplication user, simply sign in using your
          existing credentials.
        </Text>
      </Text>

      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.White}
      >
        Here's to you and the exciting path ahead! Cheers!
      </Text>

      <Button className={`${CLASS_NAME}__confirm-button`} onClick={onConfirm}>
        Got it!
        <span
          className={`${CLASS_NAME}__confirm-button__rocket`}
          role="img"
          aria-label="rocket"
        >
          {"   "}
          🚀
        </span>
      </Button>
    </FlexItem>
  );
};
