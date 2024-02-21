import {
  Button,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import "./CompletePreviewSignup.scss";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

const CLASS_NAME = "complete-preview-signup";

type Props = {
  onConfirm: () => void;
};

export const CompletePreviewSignup: React.FC<Props> = ({ onConfirm }) => {
  return (
    <FlexItem
      direction={EnumFlexDirection.Column}
      className={CLASS_NAME}
      itemsAlign={EnumItemsAlign.Center}
    >
      <Text textStyle={EnumTextStyle.H1}>
        Unleash the Magic of Amplication!
        <span role="img" aria-label="celebrate">
          {" "}
          🎉
        </span>
      </Text>
      <Realistic autorun={{ speed: 1, duration: 7 }} />
      <Text textStyle={EnumTextStyle.H4} textColor={EnumTextColor.Black20}>
        We're thrilled for the monumental leap you've taken with Amplication!
      </Text>
      <Text textStyle={EnumTextStyle.Normal} textColor={EnumTextColor.Black20}>
        By initiating this journey, you've sparked an innovative transformation
        in your backend code generation.
      </Text>
      <Text
        textStyle={EnumTextStyle.H3}
        textColor={EnumTextColor.Primary}
        className={`${CLASS_NAME}__toast`}
      >
        Let's toast to the endless opportunities ahead!
      </Text>
      <Text textStyle={EnumTextStyle.Normal} textColor={EnumTextColor.Black20}>
        But our adventure doesn't stop here! Your next move is crucial.{" "}
        <Text
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.ThemeOrange}
        >
          follow the signup process in your email to set your password.
        </Text>
      </Text>

      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        If you're already an Amplication user, simply sign in using your
        existing credentials.
      </Text>

      <Text
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.ThemeBlue}
        className={`${CLASS_NAME}__cheers`}
      >
        Here's to you and the exciting path ahead! Cheers!
      </Text>

      <Button className={`${CLASS_NAME}__confirm-button`} onClick={onConfirm}>
        Let's go!
        <span
          className={`${CLASS_NAME}__confirm-button__rocket`}
          role="img"
          aria-label="rocket"
        >
          {" "}
          🚀
        </span>
      </Button>
    </FlexItem>
  );
};
