import {
  Button,
  EnumFlexDirection,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import "./CompleteSignupDialog.scss";

const CLASS_NAME = "complete-signup-dialog";

type Props = {
  handleDialogClose: () => void;
};

export const CompleteSignupDialog: React.FC<Props> = ({
  handleDialogClose,
}) => {
  return (
    <FlexItem direction={EnumFlexDirection.Column} className={CLASS_NAME}>
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        To generate production-ready code tailored to your chosen architecture,
      </Text>
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        follow the signup process outlined in the email you just received to set
        your password.
      </Text>

      <Text textStyle={EnumTextStyle.Label} textColor={EnumTextColor.Black20}>
        If you're already an Amplication user, you can simply sign in using your
        existing credentials.
      </Text>

      <Button
        className={`${CLASS_NAME}__dismiss_button`}
        onClick={handleDialogClose}
      >
        Got it!
      </Button>
    </FlexItem>
  );
};
