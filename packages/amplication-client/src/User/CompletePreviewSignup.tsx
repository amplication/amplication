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
  HorizontalRule,
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
      contentAlign={EnumContentAlign.Center}
      gap={EnumGapSize.Default}
    >
      <Text textStyle={EnumTextStyle.H1}>
        Ready to take it to the next level?
        <span role="img" aria-label="celebrate">
          {" "}
          🎉
        </span>
      </Text>
      <Realistic autorun={{ speed: 1, duration: 7 }} />
      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Tag}
        textColor={EnumTextColor.ThemeTurquoise}
      >
        We have a 14-day trial with full access to the Enterprise edition for
        you!
      </Text>
      <HorizontalRule />
      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.White}
      >
        You've just completed the first step to building your next big thing.
        You're now part of a community of creators and innovators who are
        changing the world, one app at a time.
      </Text>

      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.White}
      >
        To continue your journey, you need to complete your registration by
        setting your password.
      </Text>
      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Normal}
        textColor={EnumTextColor.White}
      >
        Follow the link in your email to complete your registration and gain
        full access for a 14-day trial of the Enterprise edition.
      </Text>

      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Tag}
        textColor={EnumTextColor.Black20}
      >
        If you're already an Amplication user, simply sign in using your
        existing credentials.
      </Text>
      <HorizontalRule />

      <Text
        textAlign={EnumTextAlign.Center}
        textStyle={EnumTextStyle.Tag}
        textColor={EnumTextColor.ThemeTurquoise}
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
